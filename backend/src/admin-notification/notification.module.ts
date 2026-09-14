import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';

@Module({
  providers: [NotificationService],
  exports: [NotificationService], // so other modules can use it
})
export class NotificationModule {}