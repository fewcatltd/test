import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { MailerService } from './mailer.service';
import { emailService } from '../../common/constants';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(emailService.pattern)
  async handleSendEmail(
    @Payload() data: { userId: number; userLimit: number },
    @Ctx() context: RmqContext,
  ) {
    return await this.mailerService
      .sendEmail(data.userId, data.userLimit)
      .then(() => context.getChannelRef().ack(context.getMessage()))
      .catch(() => {
        context.getChannelRef().nack(context.getMessage(), false, false);
      });
  }
}
