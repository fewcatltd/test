import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;
  private readonly gmailUser: string;
  private readonly gmailPass: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    this.gmailUser = this.configService.get<string>('GMAIL_USER');
    this.gmailPass = this.configService.get<string>('GMAIL_PASS');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.gmailUser,
        pass: this.gmailPass,
      },
    });
  }

  async sendEmail(userId: number, userLimit: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.error(`User with id ${userId} not found`);
      return;
    }
    const mailOptions = {
      from: this.gmailUser,
      to: user.email,
      subject: 'Notification',
      text: 'message',
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${user.email}. User limit: ${userLimit}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw error;
    }
  }
}
