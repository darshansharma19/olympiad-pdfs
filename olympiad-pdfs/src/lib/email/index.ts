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

const SUBJECT_ICONS: Record<string, { icon: string; code: string; color: string; bg: string }> = {
  mathematics: { icon: '📐', code: 'IMO', color: '#1e40af', bg: '#eff6ff' },
  science: { icon: '🔬', code: 'ISO', color: '#047857', bg: '#f0fdf4' },
  english: { icon: '📖', code: 'IEO', color: '#7c3aed', bg: '#faf5ff' },
  computer_science: { icon: '💻', code: 'ICSO', color: '#0284c7', bg: '#f0f9ff' },
  reasoning: { icon: '🧩', code: 'IRO', color: '#c2410c', bg: '#fff7ed' },
};

function detectSubjectMeta(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('math') || lower.includes('imo')) return SUBJECT_ICONS.mathematics;
  if (lower.includes('science') || lower.includes('iso')) return SUBJECT_ICONS.science;
  if (lower.includes('english') || lower.includes('ieo')) return SUBJECT_ICONS.english;
  if (lower.includes('computer') || lower.includes('cyber') || lower.includes('icso')) return SUBJECT_ICONS.computer_science;
  if (lower.includes('reasoning') || lower.includes('logic') || lower.includes('iro')) return SUBJECT_ICONS.reasoning;
  return { icon: '📄', code: 'OLYMPIAD', color: '#1e4fd8', bg: '#eff6ff' };
}

function formatAmount(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

function buildEmailHtml(params: OrderEmailParams): string {
  const { customerName, orderId, purchaseType, isBundle, classNumber, amount, downloads } = params;

  let productTitle = 'Olympiad Practice Papers';
  let badgeLabel = 'Single Paper';
  if (purchaseType === 'bundle_5' || isBundle) {
    productTitle = classNumber
      ? `Class ${classNumber} Complete Bundle of 5 Olympiads (IMO, ISO, IEO, ICSO, IRO)`
      : `Complete Bundle of 5 Olympiad Papers`;
    badgeLabel = 'Complete 5-Subject Bundle';
  } else if (downloads.length === 1) {
    productTitle = downloads[0].productName;
    badgeLabel = 'Single Olympiad Paper';
  }

  const downloadCards = downloads
    .map((d) => {
      const meta = detectSubjectMeta(d.productName);
      const cleanName = d.productName.replace(/^Class\s+\d+\s+/i, '').replace(/Practice Papers/gi, '').trim();

      return `
      <div style="background:#ffffff;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin-bottom:12px;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;height:36px;background:${meta.bg};border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">
                    ${meta.icon}
                  </td>
                  <td style="padding-left:12px;">
                    <span style="display:inline-block;background:${meta.color};color:#ffffff;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px;letter-spacing:0.04em;text-transform:uppercase;">
                      ${meta.code}
                    </span>
                    <h3 style="margin:3px 0 0;font-size:14px;color:#0f172a;font-weight:800;line-height:1.2;">
                      ${cleanName || d.productName}
                    </h3>
                  </td>
                </tr>
              </table>
            </td>
            <td style="text-align:right;vertical-align:middle;" width="140">
              <a href="${d.url}"
                 style="display:inline-block;background:linear-gradient(135deg, #1e4fd8 0%, #0f2b6e 100%);color:#ffffff;
                        font-weight:800;font-size:12px;padding:10px 16px;
                        border-radius:8px;text-decoration:none;box-shadow:0 3px 8px rgba(30,79,216,0.3);text-align:center;white-space:nowrap;">
                ⬇ Download PDF
              </a>
            </td>
          </tr>
        </table>
      </div>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Your Olympiad Practice Papers</title>
</head>
<body style="margin:0;padding:0;background:#0b1329;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1329;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.35);">
          
          <!-- ── Header Banner ────────────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg, #071536 0%, #0f2b6e 50%, #1e4fd8 100%);padding:36px 32px 30px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <!-- Brand Pill -->
                    <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(245,197,24,0.4);border-radius:9999px;padding:5px 16px;margin-bottom:14px;">
                      <span style="color:#fef08a;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">
                        🏆 2026 Olympiad Competition Series
                      </span>
                    </div>
                    <!-- Brand Name -->
                    <h1 style="margin:0 0 6px;font-size:26px;color:#ffffff;font-weight:900;letter-spacing:-0.5px;">
                      OlympiadPDFs
                    </h1>
                    <p style="margin:0;font-size:13px;color:#cbd5e1;font-weight:500;">
                      National & International Olympiad Preparation
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Body Content ─────────────────────────────────────── -->
          <tr>
            <td style="padding:32px 28px 20px;background:#ffffff;">
              
              <!-- Greeting & Headline -->
              <h2 style="margin:0 0 10px;font-size:20px;color:#0f2b6e;font-weight:900;line-height:1.25;">
                🎉 Payment Confirmed! Your Practice Papers Are Ready
              </h2>
              <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">
                Hi <strong>${customerName}</strong>,<br>
                Thank you for preparing with <strong>OlympiadPDFs</strong>. Your purchase has been verified and your competition-standard practice papers are ready for immediate download below.
              </p>

              <!-- ── Order Receipt Card ───────────────────────────── -->
              <div style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="display:inline-block;background:#e0e7ff;color:#3730a3;font-size:10px;font-weight:800;padding:2px 8px;border-radius:9999px;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">
                        ${badgeLabel}
                      </span>
                      <h3 style="margin:0 0 8px;font-size:15px;color:#0f2b6e;font-weight:800;">
                        ${productTitle}
                      </h3>
                      <p style="margin:0;font-size:12px;color:#64748b;">
                        Order ID: <strong style="color:#0f172a;font-family:monospace;font-size:13px;">${orderId.slice(0, 8).toUpperCase()}</strong>
                      </p>
                    </td>
                    <td style="text-align:right;vertical-align:bottom;" width="110">
                      <span style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:2px;">Amount Paid</span>
                      <span style="font-size:20px;color:#1e4fd8;font-weight:900;">
                        ${formatAmount(amount)}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- ── Direct Download Cards ────────────────────────── -->
              <div style="margin-bottom:24px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                  <h3 style="margin:0;font-size:14px;color:#0f2b6e;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;">
                    📥 Click to Download (${downloads.length} Paper${downloads.length > 1 ? 's' : ''}):
                  </h3>
                </div>

                ${downloadCards}
              </div>

              <!-- ── Pro Study Tips Box ───────────────────────────── -->
              <div style="background:linear-gradient(135deg, #fffdf2 0%, #fef8db 100%);border:1.5px solid #f5c518;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
                <h4 style="margin:0 0 6px;font-size:13px;color:#92400e;font-weight:800;">
                  💡 Tips for Best Practice Results:
                </h4>
                <ul style="margin:0;padding-left:18px;font-size:12px;color:#78350f;line-height:1.6;">
                  <li><strong>Print in A4:</strong> Take printouts to simulate the actual physical Olympiad exam hall environment.</li>
                  <li><strong>Timed Practice:</strong> Set a 60-minute countdown clock to build speed and question triage ability.</li>
                  <li><strong>Review Mistakes:</strong> Re-attempt unsolved problems before looking at the final solutions.</li>
                </ul>
              </div>

              <!-- ── Access & Validity Notice ─────────────────────── -->
              <div style="background:#f1f5f9;border-radius:10px;padding:14px 16px;font-size:12px;color:#64748b;line-height:1.6;">
                ⏰ <strong>72-Hour Access:</strong> Download links remain valid for <strong>72 hours</strong> and allow up to 5 downloads per paper.<br>
                Need help or have questions? Email our team anytime at <a href="mailto:support@olympiadpdfs.com" style="color:#1e4fd8;font-weight:700;text-decoration:none;">support@olympiadpdfs.com</a>.
              </div>

            </td>
          </tr>

          <!-- ── Footer ───────────────────────────────────────────── -->
          <tr>
            <td style="background:#f8fafc;padding:24px 28px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 6px;font-size:12px;color:#64748b;font-weight:600;">
                OlympiadPDFs · School Olympiad Practice Material
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.4;">
                This email was sent to ${params.customerEmail} regarding Order #${orderId.slice(0, 8).toUpperCase()}.<br>
                © ${new Date().getFullYear()} OlympiadPDFs. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
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
  let subject = `🎯 Your Olympiad Practice Paper is Ready to Download — OlympiadPDFs`;
  if (purchaseType === 'bundle_5' || isBundle) {
    subject = `🎯 Your Class ${classNumber || ''} Complete Bundle of 5 Olympiad Papers is Ready — OlympiadPDFs`;
  } else if (downloads.length === 1) {
    subject = `🎯 Your ${downloads[0].productName} is Ready to Download — OlympiadPDFs`;
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
