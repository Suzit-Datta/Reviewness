import Pusher from 'pusher-js';

export const pusher = new Pusher(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster:
            process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,

        channelAuthorization: {
            endpoint:
                `${process.env.NEXT_PUBLIC_API_URL}/pusher/auth`,

            transport: 'ajax',

            headersProvider: () => ({
                Authorization:
                    `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
            }),
        },
    },
);