import { EmailEnquiry } from "@/lib/email";

/*
 * This function sends an email using the /api/sendEmail endpoint.
 * @param {SendEmailProps} props - The properties for sending the email.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the email was sent successfully, or rejects with an error if it failed.
 * @throws {Error} - Throws an error if the email sending fails.
 */
export const sendEmail = async ({
  user,
  subject,
  html,
  attachments,
}: EmailEnquiry) => {
  try {
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        subject,
        attachments,
        html,
      }),
    });
    const data = await res.json();
    if (data.success) {
      return Promise.resolve(true);
    }
    return Promise.reject(new Error(data.error || "Failed to send email"));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
