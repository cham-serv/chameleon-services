/**
 * Contact Form API Route
 *
 * Receives contact form submissions and sends an email via Resend.
 * Optionally validates Cloudflare Turnstile token if configured.
 */

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_EMAIL = 'chris@chameleon.services';
const FROM_EMAIL = 'noreply@chameleon.services';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, message, source, turnstileToken } = body;

    // ── Basic validation ────────────────────────────────────────────────────
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required.' },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── Turnstile verification (optional — skipped in dev if secret not set) ─
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileToken) {
      const verifyRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
          }),
        },
      );
      const verifyData = (await verifyRes.json()) as { success: boolean };
      if (!verifyData.success) {
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 },
        );
      }
    }

    // ── Send email via Resend ───────────────────────────────────────────────
    if (!process.env.RESEND_API_KEY) {
      // Dev mode: log instead of sending
      console.log('[Contact Form] Would send email:', { name, email, company, message });
      return NextResponse.json({ success: true });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` — ${company}` : ''}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
          <h2 style="margin: 0 0 24px; color: #0d1117;">New Contact Enquiry</h2>

          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666; width: 120px;">Name</td>
              <td style="padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            ${company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Company</td>
              <td style="padding: 8px 0;">${escapeHtml(company)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Phone</td>
              <td style="padding: 8px 0;">${escapeHtml(phone)}</td>
            </tr>` : ''}
            ${source ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #666;">Source</td>
              <td style="padding: 8px 0;">${escapeHtml(source)}</td>
            </tr>` : ''}
          </table>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

          <h3 style="margin: 0 0 12px; color: #0d1117;">Message</h3>
          <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API] Error:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
