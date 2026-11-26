export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Any email service (Resend, Brevo, SES, SMTP...) only has to implement this. */
export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}