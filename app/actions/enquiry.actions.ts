"use server";

import { EmailEnquiry } from "@/lib/email";
import { sendEmail } from "@/utils/email";

export async function handleEnquiryAction(
  _prevState: { success: boolean; message: string },
  input: EmailEnquiry,
) {
  try {
    if (process.env.SMTP_EMAIL) {
      await sendEmail({
        user: input.user,
        subject: "New Order Received",
        html: input.html,
      });
    }
    return { success: true, message: "Enquiry sent successfully" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to send enquiry",
    };
  }
}
