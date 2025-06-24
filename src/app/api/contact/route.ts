import { NextRequest, NextResponse } from "next/server";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

/**
 * Strips HTML tags from a string for security
 * @param str - The string to strip HTML from
 * @returns The string without HTML tags
 */
const stripHtml = (str: string): string => {
    return str.replace(/<[^>]*>/g, "");
};

/**
 * API route handler for contact form submissions
 * Sends emails directly using MailerSend
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, message } = body;

        // Validate required fields
        if (!title || !message) {
            return NextResponse.json(
                { error: "Title and message are required" },
                { status: 400 }
            );
        }

        // Strip HTML from inputs for security
        const cleanTitle = stripHtml(title.trim());
        const cleanMessage = stripHtml(message.trim());

        // Get environment variables
        const apiKey = process.env.MAILERSEND_API_KEY;
        const senderEmail = process.env.SENDER_EMAIL || "noreply@sbmi.io";
        const recipientEmail = process.env.RECIPIENT_EMAIL || "contact@sbmi.io";

        // Validate API key
        if (!apiKey) {
            console.error("MAILERSEND_API_KEY environment variable is not set");
            return NextResponse.json(
                { error: "Email service configuration error" },
                { status: 500 }
            );
        }

        // Initialize MailerSend
        const mailerSend = new MailerSend({
            apiKey: apiKey,
        });

        // Create sender and recipient
        const sentFrom = new Sender(senderEmail, "SBMI Contact Form");
        const recipients = [new Recipient(recipientEmail, "SBMI Team")];

        // Create email parameters
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(cleanTitle)
            .setText(cleanMessage)
            .setHtml(`<p>${cleanMessage.replace(/\n/g, "<br>")}</p>`);

        // Send email
        await mailerSend.email.send(emailParams);

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Email sent successfully"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            {
                error: "Failed to send email. Please try again."
            },
            { status: 500 }
        );
    }
} 