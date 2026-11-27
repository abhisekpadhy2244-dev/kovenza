import { escapeHtml as esc } from '../utils/html';
import { oneLine } from '../utils/sanitize';
import { layout, para, type RenderedEmail } from './templates';

export type ReviewOutcome = 'approved' | 'rejected' | 'info_requested';

export function creatorStatusEmail(data: {
  fullName: string;
  code: string;
  outcome: ReviewOutcome;
  message?: string | null;
}): RenderedEmail {
  const note = data.message?.trim() ? data.message.trim() : null;
  let subject: string;
  let lines: string[];

  if (data.outcome === 'approved') {
    subject = `Your KOVENZA application was approved (${data.code})`;
    lines = [
      'Good news: our team has approved your application to be part of the KOVENZA creator network.',
      'Approval means your profile may be considered for brand collaborations. It does not guarantee paid opportunities, exclusive representation or a management agreement.',
      'We will email you an invitation to activate your creator account when the creator portal opens.',
    ];
  } else if (data.outcome === 'rejected') {
    subject = `An update on your KOVENZA application (${data.code})`;
    lines = [
      'Thank you for your interest in KOVENZA. After reviewing your application, we are not able to move forward with it at this time.',
      'We appreciate the time you took to apply.',
    ];
  } else {
    subject = `We need a little more information (${data.code})`;
    lines = [
      'Thank you for applying to the KOVENZA creator network. We need a little more information before we can continue reviewing your application.',
      'Please reply to this email with the details requested below.',
    ];
  }

  const noteHtml = note
    ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;"><strong>A note from our team:</strong><br><span style="white-space:pre-wrap;">${esc(note)}</span></p>`
    : '';
  const refHtml = para(`Your reference: <strong>${esc(data.code)}</strong>`);

  return {
    subject: oneLine(subject),
    html: layout(`Hello ${data.fullName}`, lines.map((line) => para(esc(line))).join('') + noteHtml + refHtml),
    text: `Hello ${data.fullName},\n\n${lines.join('\n\n')}${note ? `\n\nA note from our team:\n${note}` : ''}\n\nYour reference: ${data.code}\n\nKOVENZA\nBRANDS x CREATORS x CULTURE.`,
  };
}