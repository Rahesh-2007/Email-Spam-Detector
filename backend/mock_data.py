"""
Mock data with realistic emails for demonstration & sandbox testing.
Includes all spam categories, legitimate emails, and multi-lingual emails (English, Tamil, Hindi, etc.).
"""

DEMO_EMAILS = [
    {
        "id": "demo-1",
        "sender": "Security Team <security-alert@acc0unt-verify-paypal-center.com>",
        "recipient": "user@company.com",
        "subject": "URGENT: Your Account Has Been Suspended - Action Required Within 24 Hours",
        "date": "2026-10-02T10:15:00Z",
        "body": """Dear Customer,

We detected unauthorized login attempts to your account from an unrecognized IP address (185.220.101.5) in Moscow, Russia on October 2, 2026 at 04:12 AM.

For your protection, your access has been temporarily restricted. To prevent permanent termination of your account, you must verify your identity immediately by clicking the secure link below:

http://secure-login.paypal-identity-check.ru/verify?id=992813

Please provide your credit card number, CVV, and current password on the verification portal.

Failure to complete this verification within 24 hours will result in permanent closure of your account and forfeiture of any remaining balance.

Regards,
Customer Security & Fraud Prevention Department
Ref: SEC-99482-TX""",
        "unread": True
    },
    {
        "id": "demo-2",
        "sender": "Dr. Sarah Jenkins <sjenkins@cloudtech-solutions.io>",
        "recipient": "user@company.com",
        "subject": "Project Nebula: Q4 Architecture Review & Sprint Planning Meeting",
        "date": "2026-10-02T09:30:00Z",
        "body": """Hi Team,

I hope you are having a productive week. 

We are scheduling the Q4 Architecture Review for Project Nebula on Thursday, October 8, 2026 at 2:00 PM EST. 

Key Agenda Items:
1. Review migration from monolithic REST API to microservices GraphQL gateway.
2. Finalize database schema adjustments for multi-region failover.
3. Review security audit findings and compliance with ISO 27001.

Action items before the meeting:
- Alex: Upload benchmark latency results to the shared Drive by Wednesday, October 7.
- Priya: Submit frontend dependency updates for React 19 compatibility.
- Please review the attached design doc (v2.4) and add your comments directly.

Let me know if you have any scheduling conflicts before tomorrow end of day.

Best regards,
Dr. Sarah Jenkins
Lead Solutions Architect | CloudTech Solutions""",
        "unread": True
    },
    {
        "id": "demo-3",
        "sender": "Mega Millions Lottery <notification@intl-sweepstakes-winner2026.org>",
        "recipient": "user@company.com",
        "subject": "CONGRATULATIONS! You have won $2,500,000.00 in the Global Cash Bonanza!",
        "date": "2026-10-01T18:45:00Z",
        "body": """CONGRATULATIONS WINNER!

We are pleased to inform you that your email address was randomly selected in the 2026 Annual International Digital Draw. You have won an official lump sum payout of $2,500,000.00 USD (Two Million Five Hundred Thousand US Dollars).

Winning Ticket No: GCB-7738-9902
Batch Ref: LP/2026/WIN

To claim your prize, please contact our fiduciary claims agent Barrister Mark Donald at claims@fiduciary-payout-online.com with the following details:
1. Full Legal Name
2. Residential Address
3. Direct Telephone Number
4. Copy of Passport or Driver's License

Note: An administrative processing fee of $250 is required for wire transfer validation before disbursement. Reply urgently to claim before the expiration deadline of October 15, 2026.""",
        "unread": False
    },
    {
        "id": "demo-4",
        "sender": "Global HR Recruiters <careers@remote-vip-jobs-global.xyz>",
        "recipient": "user@company.com",
        "subject": "High Paying Remote Job Offer: Earn $8,000 - $12,000/Month (No Experience Needed)",
        "date": "2026-10-01T14:20:00Z",
        "body": """Dear Candidate,

Your profile was recommended to us for an exclusive Work-From-Home Data Entry & Crypto Processing Specialist position.

Position Benefits:
- Flexible hours (2-3 hours per day)
- Guaranteed compensation of $500 - $800 daily paid via Bitcoin or Western Union
- No prior experience, CV, or interview required

Requirements:
- Must have smartphone or laptop with internet connection
- Age 18+
- Immediate availability

To get started today, click here to register: http://crypto-job-onboarding.link/join-now
You must deposit a refundable security token fee of $99 for your starter evaluation kit.

Warm regards,
Recruitment Manager
VIP Talent Acquisition Global""",
        "unread": False
    },
    {
        "id": "demo-5",
        "sender": "Mega Savings Deals <promo@flash-discount-store-superdeal.com>",
        "recipient": "user@company.com",
        "subject": "🔥 85% OFF FLASH SALE! Smart Watches, Laptops & Designer Shoes - Ends Tonight!",
        "date": "2026-10-01T11:10:00Z",
        "body": """HUGE CLEARANCE SALE - LIMITED STOCK!

For 24 hours only, get up to 85% off all electronics, luxury footwear, and smart gadgets.

🌟 Featured Deals:
- Ultra Pro 4K Smart Watch: Was $399 -> NOW ONLY $49.99!
- Noise Cancelling Wireless Headphones: Was $249 -> NOW $34.99!
- 15.6\" Ultra-Slim Laptop 16GB RAM: Was $1,199 -> NOW $199!

Free express shipping on all orders over $50. Use coupon code CRAZY85 at checkout.

Shop now before inventory runs out: http://flashdeal-bargains-today.cc/shop-now

To unsubscribe from our daily marketing emails, click here: http://flashdeal-bargains-today.cc/optout""",
        "unread": False
    },
    {
        "id": "demo-6",
        "sender": "Invoicing Department <billing@quick-invoice-download.top>",
        "recipient": "user@company.com",
        "subject": "Overdue Invoice INV-2026-8891 - Final Notice Before Legal Action",
        "date": "2026-09-30T16:05:00Z",
        "body": """ATTENTION: ACCOUNTS PAYABLE

Our records indicate that Invoice #INV-2026-8891 for amount $4,850.00 is currently 45 days past due.

Unless immediate payment is settled today, this file will be forwarded to our third-party debt collection agency and reported to commercial credit bureaus.

Download the official invoice statement and bank transfer details from our secure document server:
http://download-malicious-invoice-file.top/statement_oct2026.pdf.exe

Do not reply to this automated email. Pay immediately to avoid extra legal penalty fees.""",
        "unread": False
    },
    {
        "id": "demo-7",
        "sender": "Google Cloud Support <noreply@google.com>",
        "recipient": "user@company.com",
        "subject": "Google Cloud Platform: Monthly Billing Statement for September 2026",
        "date": "2026-09-30T08:00:00Z",
        "body": """Hello Google Cloud Customer,

Your monthly invoice for Google Cloud Platform services utilized during September 2026 is now available in your Google Cloud Console.

Invoice Number: GCP-2026-09-4410
Total Amount Charged: $42.50 USD
Payment Method: Visa ending in 4012 (Successfully Charged)

To review your detailed usage breakdown by service (Compute Engine, Cloud Storage, Cloud Functions), visit:
https://console.cloud.google.com/billing

If you have any questions regarding your invoice or need to update your tax registration details, please visit Google Cloud Support Center.

Thank you for choosing Google Cloud!
The Google Cloud Billing Team""",
        "unread": False
    },
    {
        "id": "demo-8",
        "sender": "Sundararajan Tech Recruiter <sundar@chennai-techhire.in>",
        "recipient": "user@company.com",
        "subject": "வேலை வாய்ப்பு: சீனியர் AI இன்ஜினியர் பதவிக்கான நேர்காணல் அழைப்பு (Senior AI Role Interview)",
        "date": "2026-09-29T15:20:00Z",
        "body": """வணக்கம்,

உங்கள் லிங்க்ட்இன் (LinkedIn) சுயவிவரத்தை நாங்கள் பார்த்தோம். நீங்கள் செய்துள்ள AI மற்றும் Machine Learning திட்டங்கள் மிகவும் சிறப்பாக உள்ளன.

சென்னையில் உள்ள எங்களது முன்னணி மென்பொருள் நிறுவனத்தில் 'Senior AI Engineer' பணிக்கான காலியிடம் உள்ளது. 

நேர்காணல் விவரங்கள்:
தேதி: அக்டோபர் 10, 2026 (சனிக்கிழமை)
நேரம்: காலை 11:00 AM IST
முறை: Google Meet வீடியோ அழைப்பு

சம்பள தொகுப்பு: ஆண்டுக்கு ₹24,00,000 - ₹32,00,000 + போனஸ்.

இந்த நேர்காணலில் கலந்து கொள்ள உங்கள் ஒப்புதலையும், தற்போதைய சுயவிவரக் குறிப்பையும் (Updated Resume) பதில் மின்னஞ்சல் மூலம் அனுப்பவும்.

நன்றி,
சுந்தரராஜன்
தலைமை ஆட்சேர்ப்பு அதிகாரி | சென்னை டெக் ஹையர்""",
        "unread": True
    },
    {
        "id": "demo-9",
        "sender": "ICICI Bank Alerts <alert-verification@banking-fraud-icici-kyc.in>",
        "recipient": "user@company.com",
        "subject": "प्रिय ग्राहक, आपका बैंक खाता 24 घंटे में ब्लॉक हो जाएगा - तुरंत KYC अपडेट करें",
        "date": "2026-09-29T12:00:00Z",
        "body": """प्रिय बैंक ग्राहक,

भारतीय रिज़र्व बैंक (RBI) के नए दिशानिर्देशों के अनुसार, आपका बैंक खाता KYC पूरा न होने के कारण 24 घंटे के भीतर निलंबित कर दिया जाएगा।

अपने खाते को सक्रिय रखने के लिए तुरंत नीचे दिए गए लिंक पर क्लिक करें और अपना पैन कार्ड, आधार कार्ड और नेट बैंकिंग पासवर्ड दर्ज करके सत्यापन पूरा करें:

http://icici-kyc-update-portal-fake.in/update

यदि आप ऐसा नहीं करते हैं, तो आपका एटीएम कार्ड और ऑनलाइन लेनदेन तुरंत रोक दिया जाएगा।

धन्यवाद,
सुरक्षा विभाग, आईसीआईसीआई बैंक""",
        "unread": True
    },
    {
        "id": "demo-10",
        "sender": "GitHub Notifications <notifications@github.com>",
        "recipient": "user@company.com",
        "subject": "[GitHub] Security Advisory: New patch release v3.4.1 available for react-router",
        "date": "2026-09-28T14:10:00Z",
        "body": """Hi developer,

A low-severity security advisory has been published for a dependency in your repository:
Repository: advanced-ai-email-spam-classifier
Package: react-router (< 6.22.0)
CVE: CVE-2026-2189
Remediation: Upgrade to version 6.22.0 or higher.

To update the package in your project:
npm install react-router@latest

View detailed vulnerability description and fix commit here:
https://github.com/remix-run/react-router/security/advisories/GHSA-xxxx

Regards,
The GitHub Dependabot Team""",
        "unread": False
    }
]
