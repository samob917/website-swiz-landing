"use server"

import { Resend } from "resend"

const resendClient =
  process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "YOUR_API_KEY"
    ? new Resend(process.env.RESEND_API_KEY)
    : null

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const company = formData.get("company") as string
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!resendClient) {
    console.error("Missing RESEND_API_KEY – email not sent.")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: "Scheduling Wizard <onboarding@resend.dev>",
      to: ["info@schedulingwizard.com"],
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (error) {
      console.error("Email error:", error)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true, message: "Email sent successfully!" }
  } catch (err) {
    console.error("Server error:", err)
    return { success: false, error: "Server error occurred" }
  }
}
