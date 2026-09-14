import {
    Body,
    Controller,
    ForbiddenException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { CompanyNotificationService } from './company-notification.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Role } from '../auth/roles.enum.js';

type AuthenticatedRequest = Request & {
    user: {
        sub: number;
        role: Role;
    };
};

@Controller('pusher')
export class CompanyNotificationController {
    constructor(
        private companyNotificationService: CompanyNotificationService,
    ) { }

    @Post('auth')
    @UseGuards(JwtAuthGuard)
    auth(
        @Req() request: AuthenticatedRequest,

        @Body()
        body: {
            socket_id: string;
            channel_name: string;
        },
    ) {
        const user = request.user;

        if (user.role !== Role.COMPANY) {
            throw new ForbiddenException(
                'Only companies can access this channel',
            );
        }

        const expectedChannel =
            `private-company-${user.sub}`;

        if (
            body.channel_name !== expectedChannel
        ) {
            throw new ForbiddenException(
                'You cannot access this company channel',
            );
        }

        return this.companyNotificationService.authenticateChannel(
            body.socket_id,
            body.channel_name,
        );
    }
}