import { User } from "@prisma/client";

export type EmailEnquiryUser = Pick<
  User,
  "firstName" | "surname" | "email" | "phone"
> & {
  address: string;
};

export type EmailAttachments = {
  filename: string;
  path: string;
  cid: string;
};

export interface EmailEnquiry {
  user: EmailEnquiryUser;
  subject: string;
  html?: string;
  attachments?: EmailAttachments[];
}
