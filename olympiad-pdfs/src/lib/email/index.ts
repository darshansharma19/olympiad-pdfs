import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL ?? 'OlympiadPDFs <noreply@olympiadpdfs.com>';

interface DownloadLink {
  productName: string;
  url: string;
}

interface OrderEmailParams {
  customerName: string;
  customerEmail: string;
  orderId: string;
  isBundle: boolean;
  classNumber?: number;
  amount: number; // in paise
  downloads: DownloadLink[];
}

function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

function buildEmailHtml(params: OrderEmailParams): string {
  const { customerName, orderId, isBundle, classNumber, amount, downloads } = params;

  const productTitle = isBundle && classNumber
    ? `Class ${classNumber} Complete Bundle — All 5 Subjects`
    : downloads[0]?.productName ?? 'Olympiad Practice Papers';

  const downloadButtons = downloads
    .map(
      (d) => `
    <tr>
      <td style="padding:6px 0;">
        <a href="${d.url}"
           style="display:inline-block;background:#1a3a8f;color:#fff;
                  font-weight:700;font-size:15px;padding:12px 28px;
                  border-radius:8px;text-decoration:none;">
          ${isBundle ? `⬇ ${d.productName.replace(/Class \d+ | Olympiad Practice Papers/g, '').trim()}` : '⬇ Download Your Practice Paper'}
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
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1a3a8f;padding:28px 32px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#fff;font-weight:800;letter-spacing:-0.5px;">
              📚 OlympiadPDFs
            </h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 32px;">
            <h2 style="margin:0 0 8px;font-size:20px;color:#1a3a8f;font-weight:800;">
              🎯 Your Practice Paper${isBundle ? 's are' : ' is'} Ready!
            </h2>
            <p style="margin:0 0 24px;font-size:15px;color:#4a5568;line-height:1.6;">
              Hi ${customerName},<br><br>
              Thank you for purchasing from <strong>OlympiadPDFs</strong>. Your order has been confirmed and your practice paper${isBundle ? 's are' : ' is'} ready to download.
            </p>
            <!-- Order Summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f9;border-radius:8px;padding:20px;margin-bottom:28px;">
              <tr>
                <td style="font-size:13px;color:#6b7a99;padding-bottom:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">
                  Order Summary
                </td>
              </tr>
              <tr>
                <td style="font-size:15px;color:#1e293b;font-weight:700;padding-bottom:4px;">
                  ${productTitle}
                </td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#6b7a99;padding-bottom:4px;">
                  Order ID: <span style="color:#1e293b;font-weight:600;">${orderId.slice(0, 8).toUpperCase()}</span>
                </td>
              </tr>
              <tr>
                <td style="font-size:18px;color:#1a3a8f;font-weight:800;padding-top:8px;">
                  Amount Paid: ${formatAmount(amount)}
                </td>
              </tr>
            </table>
            <!-- Download Buttons -->
            <p style="margin:0 0 16px;font-size:15px;color:#1e293b;font-weight:700;">
              Click below to download your PDF${downloads.length > 1 ? 's' : ''}:
            </p>
            <table cellpadding="0" cellspacing="0">
              ${downloadButtons}
            </table>
            <p style="margin:24px 0 0;font-size:13px;color:#9aa5c4;line-height:1.6;">
              ⏰ Download links are valid for <strong>72 hours</strong> and can be used up to 5 times.<br>
              If you have any issues, email us at <a href="mailto:support@olympiadpdfs.com" style="color:#1a3a8f;">support@olympiadpdfs.com</a>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fc;padding:20px 32px;text-align:center;border-top:1px solid #e2e6f0;">
            <p style="margin:0;font-size:12px;color:#9aa5c4;">
              OlympiadPDFs · Expert Olympiad Preparation<br>
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

export async function sendOrderEmail(params: OrderEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_xxxxxxxxxxxx') {
    console.log('[email] RESEND_API_KEY not configured — skipping email send');
    console.log('[email] Would send to:', params.customerEmail);
    console.log('[email] Downloads:', params.downloads.map((d) => d.url));
    return;
  }

  const isBundle = params.isBundle && params.classNumber;
  const subject = isBundle
    ? `Your Class ${params.classNumber} Complete Bundle is Ready 🎯 — OlympiadPDFs`
    : `Your Practice Paper is Ready 🎯 — OlympiadPDFs`;

  await resend.emails.send({
    from: FROM,
    to: params.customerEmail,
    subject,
    html: buildEmailHtml(params),
  });
}
