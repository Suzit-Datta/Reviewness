import { Module } from '@nestjs/common';

import { CompanyNotificationController } from './company-notification.controller.js';
import { CompanyNotificationService } from './company-notification.service.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
    imports: [
        AuthModule,
    ],

    controllers: [
        CompanyNotificationController,
    ],

    providers: [
        CompanyNotificationService,
    ],

    exports: [
        CompanyNotificationService,
    ],
})
export class CompanyNotificationModule { }