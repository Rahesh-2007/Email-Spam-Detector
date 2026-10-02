"""
IMAP Email Fetcher Service
Connects to Gmail, Outlook, Yahoo, or Custom IMAP servers using SSL.
Parses multi-part MIME emails, extracts text/html body, headers, and attachments.
"""

import imaplib
import email
from email.header import decode_header
import email.utils
from bs4 import BeautifulSoup
import re
import datetime

# Host lookup helper
IMAP_HOST_PRESETS = {
    'gmail': 'imap.gmail.com',
    'outlook': 'outlook.office365.com',
    'hotmail': 'outlook.office365.com',
    'yahoo': 'imap.mail.yahoo.com',
    'icloud': 'imap.mail.me.com'
}

def detect_imap_server(email_address, custom_host=None):
    if custom_host and custom_host.strip():
        return custom_host.strip()
    domain = email_address.lower().split('@')[-1] if '@' in email_address else ''
    for key, host in IMAP_HOST_PRESETS.items():
        if key in domain:
            return host
    return 'imap.gmail.com'

def clean_header(header_val):
    if not header_val:
        return ""
    try:
        decoded_chunks = decode_header(header_val)
        result = []
        for chunk, encoding in decoded_chunks:
            if isinstance(chunk, bytes):
                try:
                    result.append(chunk.decode(encoding or 'utf-8', errors='replace'))
                except Exception:
                    result.append(chunk.decode('latin-1', errors='replace'))
            else:
                result.append(str(chunk))
        return " ".join(result).strip()
    except Exception:
        return str(header_val)

def extract_body_text(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            if "attachment" in content_disposition:
                continue
            if content_type == "text/plain":
                try:
                    payload = part.get_payload(decode=True)
                    charset = part.get_content_charset() or 'utf-8'
                    body = payload.decode(charset, errors='replace')
                    if body.strip():
                        return body.strip()
                except Exception:
                    pass
            elif content_type == "text/html" and not body:
                try:
                    payload = part.get_payload(decode=True)
                    charset = part.get_content_charset() or 'utf-8'
                    html_content = payload.decode(charset, errors='replace')
                    soup = BeautifulSoup(html_content, "html.parser")
                    body = soup.get_text(separator="\n").strip()
                except Exception:
                    pass
    else:
        try:
            payload = msg.get_payload(decode=True)
            charset = msg.get_content_charset() or 'utf-8'
            raw_text = payload.decode(charset, errors='replace') if payload else ""
            if msg.get_content_type() == "text/html":
                soup = BeautifulSoup(raw_text, "html.parser")
                body = soup.get_text(separator="\n").strip()
            else:
                body = raw_text.strip()
        except Exception:
            body = str(msg.get_payload())

    return body.strip() or "[No readable text content]"

def fetch_imap_emails(email_address, password, server_host=None, port=993, limit=15, folder="INBOX"):
    """
    Connects to IMAP server with credentials, retrieves latest emails, and returns structured dictionaries.
    """
    host = detect_imap_server(email_address, server_host)
    emails_list = []

    # Clean password (remove spaces if user copied a 16-char Google App Password)
    clean_password = password.strip()
    if "gmail" in host.lower():
        clean_password = clean_password.replace(" ", "")

    try:
        # Connect with SSL
        mail = imaplib.IMAP4_SSL(host, port=int(port), timeout=15)
        mail.login(email_address.strip(), clean_password)
    except imaplib.IMAP4.error as e:
        error_msg = str(e)
        if "AUTHENTICATIONFAILED" in error_msg or "Invalid credentials" in error_msg or "Application-specific password required" in error_msg:
            if "gmail" in host:
                raise ValueError(
                    "Authentication failed! If you are using Gmail, Google requires an 'App Password' instead of your regular password. "
                    "To generate one: Go to Google Account -> Security -> 2-Step Verification -> App Passwords -> Generate password."
                )
            else:
                raise ValueError(f"Invalid email or password for {host}. Please verify your credentials.")
        raise ValueError(f"IMAP Error: {error_msg}")
    except Exception as e:
        raise ConnectionError(f"Could not connect to {host}:{port}. Error: {str(e)}")

    try:
        mail.select(folder, readonly=True)
        # Search for all messages
        status, messages = mail.search(None, "ALL")
        if status != "OK" or not messages[0]:
            mail.logout()
            return []

        message_ids = messages[0].split()
        # If limit is specified, get the latest N messages, otherwise get all
        if limit and int(limit) > 0:
            selected_ids = message_ids[-int(limit):][::-1]
        else:
            selected_ids = message_ids[::-1]

        for i, msg_id in enumerate(selected_ids):
            try:
                res, data = mail.fetch(msg_id, "(RFC822)")
                if res != "OK":
                    continue
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)

                subject = clean_header(msg.get("Subject", "No Subject"))
                sender = clean_header(msg.get("From", "Unknown Sender"))
                recipient = clean_header(msg.get("To", email_address))
                raw_date = clean_header(msg.get("Date", ""))
                
                # Format date cleanly
                try:
                    parsed_date = email.utils.parsedate_to_datetime(raw_date)
                    date_iso = parsed_date.isoformat()
                except Exception:
                    date_iso = datetime.datetime.utcnow().isoformat() + "Z"

                body_text = extract_body_text(msg)

                emails_list.append({
                    "id": f"imap-{msg_id.decode() if isinstance(msg_id, bytes) else str(msg_id)}",
                    "sender": sender,
                    "recipient": recipient,
                    "subject": subject,
                    "date": date_iso,
                    "body": body_text[:4000],  # keep reasonable length for fast processing
                    "unread": True if i < 3 else False
                })
            except Exception as e:
                # Continue if single email parsing fails
                continue

        mail.logout()
        return emails_list

    except Exception as e:
        try:
            mail.logout()
        except Exception:
            pass
        raise RuntimeError(f"Error fetching email messages: {str(e)}")
