export interface SendEmailPayload {
  userId: string;
  userLimit: number;
  email: string;
  subject: string;
  text: string;
}
