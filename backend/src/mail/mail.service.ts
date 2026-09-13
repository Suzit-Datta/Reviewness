import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
    ) { }

    async sendRegistrationMail(
        email: string,
        name: string,
    ): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Reviewness',
            html: `
        <h2>Welcome to Reviewness, ${name}!</h2>

        <p>Your account has been created successfully.</p>

        <p>
          Thank you for joining Reviewness.
        </p>

        <p>
          You can now use your account to access the platform.
        </p>

        <br>

        <p>Regards,</p>
        <p><strong>Reviewness Team</strong></p>
      `,
        });
    }
}