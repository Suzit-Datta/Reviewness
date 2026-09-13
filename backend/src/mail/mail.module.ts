import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service.js';

@Module({
  imports: [
    ConfigModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: Number(
            configService.get<string>('MAIL_PORT'),
          ),
          secure: false,

          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>(
              'MAIL_PASSWORD',
            ),
          },
        },

        defaults: {
          from: `"Reviewness" <${configService.get<string>(
            'MAIL_USER',
          )}>`,
        },
      }),
    }),
  ],

  providers: [MailService],

  exports: [MailService],
})
export class MailModule {}