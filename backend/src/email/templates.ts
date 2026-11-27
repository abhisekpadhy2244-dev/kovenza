import { escapeHtml as esc } from '../utils/html';
import { oneLine } from '../utils/sanitize';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

type Row = [label: string, value: string | number | null | undefined];

export function layout(heading: string, body: string): string {
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#F2F3F7;font-family:Arial,Helvetica,sans-serif;color:#25283A;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;">
<tr><td style="background:#10152B;padding:22px 28px;color:#FFFFFF;font-size:20px;letter-spacing:3px;">KOV&Eacute;NZA</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#10152B;">${esc(heading)}</h1>
${body}
</td></tr>
<tr><td style="padding:18px 28px;background:#F2F3F7;font-size:12px;color:#667085;">BRANDS &times; CREATORS &times; CULTURE.</td></tr>
</table></td></tr></table></body></html>`;
}

function details(rows: Row[]): { html: string; text: string } {
  const shown = rows.filter(([, value]) => value !== null && value !== undefined && String(value) !== '');
  const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${shown
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;font-size:13px;color:#667085;width:170px;">${esc(label)}</td><td style="padding:8px 0;vertical-align:top;font-size:14px;color:#10152B;white-space:pre-wrap;">${esc(String(value))}</td></tr>`,
    )
    .join('')}</table>`;
  const text = shown.map(([label, value]) => `${label}: ${value}`).join('\n');
  return { html, text };
}

export const para = (value: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">${value}</p>`;

// ---------------------------------------------------------------------------
// Brand enquiry
// ---------------------------------------------------------------------------

export interface BrandEnquiryEmailData {
  code: string;
  fullName: string;
  businessEmail: string;
  companyName: string;
  country: string;
  phone: string;
  website: string;
  industry: string;
  service: string;
  objective: string;
  budgetRange?: string | null;
  timeline: string;
  additionalInfo?: string | null;
}

export function brandEnquiryAdminEmail(data: BrandEnquiryEmailData): RenderedEmail {
  const table = details([
    ['Enquiry ID', data.code],
    ['Name', data.fullName],
    ['Business email', data.businessEmail],
    ['Company', data.companyName],
    ['Country', data.country],
    ['Phone', data.phone],
    ['Website', data.website],
    ['Industry', data.industry],
    ['Service required', data.service],
    ['Campaign objective', data.objective],
    ['Budget range', data.budgetRange],
    ['Expected timeline', data.timeline],
    ['Additional information', data.additionalInfo],
  ]);
  return {
    subject: oneLine(`New brand enquiry ${data.code}: ${data.companyName}`),
    html: layout('New brand enquiry', table.html + para('You can reply to this email to reach the brand directly.')),
    text: `New brand enquiry\n\n${table.text}\n\nReply to this email to reach the brand directly.`,
  };
}

export function brandEnquiryAckEmail(data: { fullName: string; code: string }): RenderedEmail {
  const intro = 'Thank you for contacting KOVÉNZA. We have received your enquiry and our team will review it.';
  const ref = `Your reference is ${data.code}. Please quote it if you contact us about this enquiry.`;
  return {
    subject: `We received your enquiry (${data.code})`,
    html: layout(
      `Thank you, ${data.fullName}`,
      para(esc(intro)) + para(`Your reference is <strong>${esc(data.code)}</strong>. Please quote it if you contact us about this enquiry.`),
    ),
    text: `Hello ${data.fullName},\n\n${intro}\n\n${ref}\n\nKOVÉNZA\nBRANDS × CREATORS × CULTURE.`,
  };
}

// ---------------------------------------------------------------------------
// Creator application
// ---------------------------------------------------------------------------

export interface CreatorApplicationEmailData {
  code: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  category: string;
  instagram?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  otherSocials?: string | null;
  audienceSize?: number | null;
  languages: string[];
  biography: string;
  collaborationInterests: string;
  hasMediaKit: boolean;
}

export function creatorApplicationAdminEmail(data: CreatorApplicationEmailData): RenderedEmail {
  const table = details([
    ['Application ID', data.code],
    ['Name', data.fullName],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Location', `${data.city}, ${data.country}`],
    ['Content category', data.category],
    ['Instagram', data.instagram],
    ['YouTube', data.youtube],
    ['TikTok', data.tiktok],
    ['Other profiles', data.otherSocials],
    ['Audience size (self-reported)', data.audienceSize?.toLocaleString('en-US')],
    ['Languages', data.languages.join(', ')],
    ['Biography', data.biography],
    ['Collaboration interests', data.collaborationInterests],
    ['Media kit attached', data.hasMediaKit ? 'Yes (view it in the admin dashboard)' : 'No'],
  ]);
  return {
    subject: oneLine(`New creator application ${data.code}: ${data.fullName}`),
    html: layout('New creator application', table.html + para('Review this application in the admin dashboard.')),
    text: `New creator application\n\n${table.text}\n\nReview this application in the admin dashboard.`,
  };
}

export function creatorApplicationAckEmail(data: { fullName: string; code: string }): RenderedEmail {
  const intro = 'Thank you for applying to be part of the KOVÉNZA creator network. We have received your application and our team will review it.';
  const notice = 'Applying does not guarantee acceptance, paid opportunities, exclusive representation or a management agreement.';
  const ref = `Your reference is ${data.code}.`;
  return {
    subject: `We received your application (${data.code})`,
    html: layout(
      `Thank you, ${data.fullName}`,
      para(esc(intro)) +
        para(`Your reference is <strong>${esc(data.code)}</strong>.`) +
        para(`<span style="color:#667085;">${esc(notice)}</span>`),
    ),
    text: `Hello ${data.fullName},\n\n${intro}\n\n${ref}\n\n${notice}\n\nKOVÉNZA\nBRANDS × CREATORS × CULTURE.`,
  };
}