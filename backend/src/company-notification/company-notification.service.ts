import { Injectable } from '@nestjs/common';

import Pusher from 'pusher';

@Injectable()
export class CompanyNotificationService {
    pusher: Pusher;

    constructor() {
        this.pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID!,
            key: process.env.PUSHER_KEY!,
            secret: process.env.PUSHER_SECRET!,
            cluster: process.env.PUSHER_CLUSTER!,
            useTLS: true,
        });
    }

    async sendReviewNotification(
        companyId: number,
        data: {
            postId: number;
            productId: number;
            message: string;
        },
    ) {
        await this.pusher.trigger(
            `private-company-${companyId}`,
            'new-review',
            data,
        );
    }

    authenticateChannel(
        socketId: string,
        channelName: string,
    ) {
        return this.pusher.authorizeChannel(
            socketId,
            channelName,
        );
    }
}