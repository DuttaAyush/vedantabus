/**
 * EmailJS Client Integration for VedantaBus Admin Portal
 * Dispatches verification OTPs and email notifications via EmailJS.
 *
 * Setup in .env.local:
 *   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
 *   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
 *   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
 */

export async function sendOtpEmail(email, otp) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: email,
            email: email,
            to_name: email.split('@')[0],
            otp: otp,
            otp_code: otp,
            passcode: otp,
            app_name: 'VedantaBus Admin Portal',
            company_name: 'VedantaBus Operations',
          },
        }),
      });

      if (res.ok) {
        return { success: true, provider: 'emailjs' };
      }
      const errText = await res.text();
      console.warn('[Admin EmailJS] API returned non-200:', errText);
    } catch (err) {
      console.error('[Admin EmailJS] Network error while sending OTP email:', err);
    }
  } else {
    console.info('[Admin EmailJS] Config not detected in env. Using development OTP mode.');
  }

  return { success: true, provider: 'fallback' };
}
