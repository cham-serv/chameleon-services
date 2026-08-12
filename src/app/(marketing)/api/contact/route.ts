import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

// --- Rate Limiting (in-memory, per-IP) ---
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5 // max 5 requests per window

const rateLimitMap = new Map<string, { count: number; firstRequest: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true
  }

  entry.count++
  return false
}

// --- HTML Escaping (prevents XSS in email templates) ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  // Fail explicitly if the API key is missing
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY environment variable is not set.')
    return NextResponse.json(
      { error: 'Server configuration error. Please try again later.' },
      { status: 500 }
    )
  }

  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  const resend = new Resend(apiKey)

  try {
    const body = await req.json()
    const { name, email, company, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // Sanitise all user inputs before embedding in HTML
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeCompany = company ? escapeHtml(company) : ''
    const safeService = service ? escapeHtml(service) : ''
    const safeMessage = escapeHtml(message)

    await resend.emails.send({
      from: 'Chameleon Website <hello@chameleon.services>',
      to: ['hello@chameleon.services'],
      replyTo: email,
      subject: `New Enquiry: ${safeService || 'General'} — ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0B132B;">
          <div style="background: #0B132B; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #00E5FF; margin: 0; font-size: 20px;">New Website Enquiry</h1>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8D99AE; font-size: 13px; width: 100px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8D99AE; font-size: 13px;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #00B4D8;">${safeEmail}</a></td>
              </tr>
              ${safeCompany ? `<tr><td style="padding: 8px 0; color: #8D99AE; font-size: 13px;">Company</td><td style="padding: 8px 0;">${safeCompany}</td></tr>` : ''}
              ${safeService ? `<tr><td style="padding: 8px 0; color: #8D99AE; font-size: 13px;">Service</td><td style="padding: 8px 0;"><span style="background: rgba(0,229,255,0.1); color: #00B4D8; padding: 2px 8px; border-radius: 4px; font-size: 13px;">${safeService}</span></td></tr>` : ''}
            </table>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #8D99AE; text-transform: uppercase; letter-spacing: 0.06em;">Message</h3>
            <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
