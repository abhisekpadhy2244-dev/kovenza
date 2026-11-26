import type { EmailMessage, EmailProvider } from './provider';

export class ConsoleProvider implements EmailProvider {
  readonly name = 'console';

  async send(message: EmailMessage): Promise<void> {
    const to = Array.isArray(message.to) ? message.to.join(', ') : message.to;
    console.log('\n----- EMAIL (console provider) -----');
    console.log(`To:      ${to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(message.text);
    console.log('------------------------------------\n');
  }
}