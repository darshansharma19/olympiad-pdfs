import { Resend } from 'resend';

const FROM = process.env.FROM_EMAIL ?? 'OlympiadPDFs <onboarding@resend.dev>';

interface DownloadLink {
  productName: string;
  url: string;
}

interface OrderEmailParams {
  customerName: string;
  customerEmail: string;
  orderId: string;
  purchaseType?: string;
  isBundle?: boolean;
  classNumber?: number;
  amount: number; // in paise
  downloads: DownloadLink[];
}

function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

function buildEmailHtml(params: OrderEmailParams): string {
  const { customerName, orderId, purchaseType, isBundle, classNumber, amount, downloads } = params;

  let productTitle = 'Olympiad Practice Papers';
  if (purchaseType === 'bundle_5' || isBundle) {
    productTitle = classNumber
      ? `Class ${classNumber} Complete Bundle of 5 Olympiad Papers (IMO, ISO, IEO, ICSO, IRO)`
      : `Complete Bundle of 5 Olympiad Papers`;
  } else if (purchaseType === 'pack_2') {
    productTitle = classNumber
      ? `Class ${classNumber} Olympiad Pack of 2 Papers`
      : `Olympiad Pack of 2 Papers`;
  } else if (downloads.length === 1) {
    productTitle = downloads[0].productName;
  }

  const downloadButtons = downloads
    .map(
      (d) => `
    <tr>
      <td style="padding:6px 0;">
        <a href="${d.url}"
           style="display:inline-block;background:#1e4fd8;color:#ffffff;
                  font-weight:800;font-size:14px;padding:12px 24px;
                  border-radius:8px;text-decoration:none;box-shadow:0 2px 6px rgba(30,79,216,0.3);">
          ⬇ Download: ${d.productName.replace(/Practice Papers/g, '').trim()}
        </a>
      </td>
    </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fc;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fc;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg, #0f2b6e 0%, #1e4fd8 100%);padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:900;letter-spacing:-0.5px;">
              📚 OlympiadPDFs
            </h1>
            <p style="margin:4px 0 0;font-size:12px;color:#f5c518;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
              Expert Practice · Instant Download
            </p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 32px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#0f2b6e;font-weight:800;">
              🎯 Your Olympiad Practice Paper${downloads.length > 1 ? 's are' : ' is'} Ready!
            </h2>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
              Hi <strong>${customerName}</strong>,<br><br>
              Thank you for purchasing from <strong>OlympiadPDFs</strong>. Your payment was successful and your practice paper${downloads.length > 1 ? 's are' : ' is'} ready to download below.
            </p>
            <!-- Order Summary Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:28px;">
              <tr>
                <td style="font-size:12px;color:#64748b;padding-bottom:8px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;">
                  Order Summary
                </td>
              </tr>
              <tr>
                <td style="font-size:15px;color:#0f2b6e;font-weight:800;padding-bottom:6px;">
                  ${productTitle}
                </td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#64748b;padding-bottom:4px;">
                  Order ID: <span style="color:#0f2b6e;font-weight:700;font-family:monospace;">${orderId.slice(0, 8).toUpperCase()}</span>
                </td>
              </tr>
              <tr>
                <td style="font-size:18px;color:#0f2b6e;font-weight:900;padding-top:8px;border-top:1px solid #e2e8f0;">
                  Amount Paid: <span style="color:#1e4fd8;">${formatAmount(amount)}</span>
                </td>
              </tr>
            </table>

            <!-- Download Buttons -->
            <p style="margin:0 0 16px;font-size:15px;color:#0f2b6e;font-weight:800;">
              Click below to download your PDF${downloads.length > 1 ? 's' : ''}:
            </p>
            <table cellpadding="0" cellspacing="0" width="100%">
              ${downloadButtons}
            </table>

            <p style="margin:28px 0 0;font-size:13px;color:#64748b;line-height:1.6;background:#f1f5f9;padding:12px 16px;border-radius:8px;">
              ⏰ <strong>Download Validity:</strong> Links are valid for <strong>72 hours</strong> and can be used up to 5 times.<br>
              Need assistance? Simply reply to this email or reach us at <a href="mailto:support@olympiadpdfs.com" style="color:#1e4fd8;font-weight:700;">support@olympiadpdfs.com</a>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              OlympiadPDFs · Expert Olympiad Practice Papers<br>
              © ${new Date().getFullYear()} OlympiadPDFs. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
 </body>
</html>`;
}

export async function sendOrderEmail(params: OrderEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_xxxxxxxxxxxx') {
    console.log('[email] RESEND_API_KEY not configured — skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);

  const { purchaseType, isBundle, classNumber, downloads } = params;
  let subject = `Your Olympiad Practice Paper is Ready 🎯 — OlympiadPDFs`;
  if (purchaseType === 'bundle_5' || isBundle) {
    subject = `Your Class ${classNumber || ''} Complete Bundle of 5 Olympiad Papers is Ready 🎯 — OlympiadPDFs`;
  } else if (downloads.length === 1) {
    subject = `Your ${downloads[0].productName} is Ready 🎯 — OlympiadPDFs`;
  }

  try {
    const res = await resend.emails.send({
      from: FROM,
      to: params.customerEmail,
      subject,
      html: buildEmailHtml(params),
    });

    if (res.error) {
      console.error('[email] Resend API Error:', res.error);
      return { success: false, error: res.error.message };
    }

    console.log(`[email] Email delivered successfully to ${params.customerEmail} (ID: ${res.data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error('[email] Exception sending email:', err);
    return { success: false, error: err.message };
  }
}
