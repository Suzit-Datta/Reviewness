import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class NotificationService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  // Notify admins that a new employee registered and needs approval
  async notifyNewEmployee(employee: { id: number; userName: string; email: string }) {
    await this.pusher.trigger('admin-notifications', 'new-employee', {
      id: employee.id,
      userName: employee.userName,
      email: employee.email,
      message: `New employee "${employee.userName}" is awaiting approval.`,
    });
  }
}