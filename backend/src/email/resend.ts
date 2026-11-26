import { Resend } from 'resend';
import type { EmailMessage, EmailProvider } from './provider';

export class ResendProvider implements EmailProvider {
  readonly name = 'resend';
  private readonly client: Resend;

  constructor(
    apiKey: string,
    private readonly from: string,
  ) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.from,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) {
      throw new Error(`Resend error: ${error.message}`);
    }
  }
}