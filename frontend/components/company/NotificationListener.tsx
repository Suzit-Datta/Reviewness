'use client';

import { useEffect } from 'react';

import { pusher } from '@/lib/pusher';
import { getRole, getUserId } from '@/lib/auth';

type ReviewNotification = {
    postId: number;
    productId: number;
    message: string;
};

export default function NotificationListener() {
    useEffect(() => {
        const role = getRole();
        const companyId = getUserId();

        if (role !== 'COMPANY' || !companyId) {
            return;
        }

        const channel = pusher.subscribe(
            `private-company-${companyId}`,
        );

        channel.bind(
            'new-review',
            (data: ReviewNotification) => {
                console.log(
                    'New review notification:',
                    data,
                );

                alert(data.message);
            },
        );

        return () => {
            channel.unbind('new-review');

            pusher.unsubscribe(
                `private-company-${companyId}`,
            );
        };
    }, []);

    return null;
}