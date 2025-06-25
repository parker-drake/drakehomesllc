# 📧 EmailJS Setup Guide for Drake Homes LLC

Your contact forms are now ready to send real emails! Follow this guide to set up EmailJS and start receiving customer inquiries.

## 🎯 What You'll Get
- **Property inquiries** sent directly to your email
- **General contact form** submissions
- **Professional email formatting** with all customer details
- **Free up to 200 emails/month**

---

## 📋 Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://emailjs.com) and click **"Sign Up"**
2. Create account with your email (recommend using your Drake Homes email)
3. Verify your email address

---

## ⚙️ Step 2: Set Up Email Service

1. In EmailJS dashboard, click **"Add New Service"**
2. Choose your email provider:
   - **Gmail** (recommended for personal)
   - **Outlook** (recommended for business)
   - **Yahoo** or other
3. Connect your email account and authorize EmailJS
4. **Copy the Service ID** - you'll need this later

---

## 📝 Step 3: Create Email Templates

You need to create **2 email templates** for your forms:

### Template 1: Property Inquiries

1. Click **"Create New Template"**
2. **Template Name**: `Property Inquiry - Drake Homes`
3. **Template Content**:

```
Subject: New Property Inquiry - {{property_title}}

You have a new property inquiry from your website!

CUSTOMER DETAILS:
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

PROPERTY DETAILS:
Property: {{property_title}}
Price: {{property_price}}
Location: {{property_location}}
Property URL: {{property_url}}

MESSAGE:
{{message}}

---
This inquiry was sent from your Drake Homes LLC website.
Reply directly to this email to contact the customer.
```

4. **Save template** and copy the **Template ID**

### Template 2: General Contact Form

1. Click **"Create New Template"**
2. **Template Name**: `General Contact - Drake Homes`
3. **Template Content**:

```
Subject: New Contact Form Submission - {{subject}}

You have a new message from your website contact form!

CUSTOMER DETAILS:
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

MESSAGE:
{{message}}

---
This message was sent from your Drake Homes LLC website.
Reply directly to this email to contact the customer.
```

4. **Save template** and copy the **Template ID**

---

## 🔑 Step 4: Get Your Public Key

1. In EmailJS dashboard, go to **"Account"** → **"General"**
2. Find **"Public Key"** section
3. **Copy your Public Key**

---

## 🌍 Step 5: Add Environment Variables

Create a file called `.env.local` in your project root with these values:

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_PROPERTY=your_property_template_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=your_contact_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Replace the placeholder values with:**
- `your_service_id_here` → Service ID from Step 2
- `your_property_template_id_here` → Property template ID from Step 3
- `your_contact_template_id_here` → Contact template ID from Step 3
- `your_public_key_here` → Public key from Step 4

---

## 📧 Step 6: Update Your Email Address

In the code files, replace `your-email@drakehomesllc.com` with your actual email:

### Files to update:
1. `app/available-homes/[id]/page.tsx` (line with `to_email:`)
2. `app/contact/page.tsx` (line with `to_email:`)

Change:
```typescript
to_email: 'your-email@drakehomesllc.com'
```

To:
```typescript
to_email: 'parker@drakehomesllc.com'  // Your actual email
```

---

## 🚀 Step 7: Test Your Forms

1. **Restart your development server**: `npm run dev`
2. **Test property form**:
   - Go to any property detail page
   - Fill out the contact form
   - Submit and check your email
3. **Test contact form**:
   - Go to `/contact` page
   - Fill out the form
   - Submit and check your email

---

## ✅ Step 8: Deploy Changes

1. **Commit and push** your changes to GitHub
2. **Deploy to production** (Vercel, Netlify, etc.)
3. **Add environment variables** in your hosting platform:
   - Add the same 4 environment variables from `.env.local`
   - Make sure they're marked as "production" variables

---

## 📊 Email Limits

**Free EmailJS Plan:**
- ✅ **200 emails/month**
- ✅ **Unlimited templates**
- ✅ **No setup fees**

**If you exceed 200 emails/month:**
- Upgrade to EmailJS Pro ($15/month for 1,000 emails)
- Or implement a professional email service (SendGrid, Mailgun)

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Service not found" error**
- Check your Service ID in `.env.local`
- Make sure it matches exactly from EmailJS dashboard

**2. "Template not found" error**
- Check your Template IDs in `.env.local`
- Verify templates are published in EmailJS dashboard

**3. "Public key invalid" error**
- Check your Public Key in `.env.local`
- Regenerate key if needed in EmailJS dashboard

**4. Emails not arriving**
- Check spam/junk folder
- Verify email address in template settings
- Test with different email addresses

**5. Environment variables not working**
- Restart development server after adding `.env.local`
- For production, add variables in hosting platform dashboard

---

## 📞 Need Help?

If you have issues with setup:
1. Check the EmailJS documentation: [docs.emailjs.com](https://docs.emailjs.com)
2. Test your setup in EmailJS dashboard first
3. Check browser console for error messages

---

## 🎉 You're All Set!

Once configured, you'll receive professional emails from customers with all their details and property information. The emails will come from EmailJS but include the customer's email as the reply-to address, so you can respond directly! 