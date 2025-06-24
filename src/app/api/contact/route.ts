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
        console.log("Contact API route called");

        const body = await request.json();
        const { fromEmail, title, message } = body;

        console.log("Request body parsed:", { fromEmail, title, message });

        // Validate required fields
        if (!fromEmail || !title || !message) {
            console.log("Missing required fields");
            return NextResponse.json(
                { error: "From email, title, and message are required" },
                { status: 400 }
            );
        }

        // Strip HTML from inputs for security
        const cleanFromEmail = stripHtml(fromEmail.trim());
        const cleanTitle = stripHtml(title.trim());
        const cleanMessage = stripHtml(message.trim());

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanFromEmail)) {
            console.log("Invalid email format:", cleanFromEmail);
            return NextResponse.json(
                { error: "Invalid email address format" },
                { status: 400 }
            );
        }

        // Get environment variables
        const apiKey = process.env.MAILERSEND_API_KEY;
        const senderEmail = cleanFromEmail || process.env.SENDER_EMAIL || "noreply@sbmi.io";
        const recipientEmail = process.env.RECIPIENT_EMAIL || "contact@sbmi.io";

        console.log("Environment check:", {
            hasApiKey: !!apiKey,
            recipientEmail,
            senderEmail
        });

        // Validate API key
        if (!apiKey) {
            console.error("MAILERSEND_API_KEY environment variable is not set");
            return NextResponse.json(
                { error: "Email service configuration error" },
                { status: 500 }
            );
        }

        // Initialize MailerSend
        console.log("Initializing MailerSend...");
        const mailerSend = new MailerSend({
            apiKey: apiKey,
        });

        // Create sender and recipient
        const sentFrom = new Sender(senderEmail, "SBMI Contact Form");
        const recipients = [new Recipient(recipientEmail, "SBMI Team")];

        console.log("Created sender and recipient objects");

        // Create email content with sender information
        const emailText = `From: ${cleanFromEmail}\n\nSubject: ${cleanTitle}\n\nMessage:\n${cleanMessage}`;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">Contact Form Submission</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>From:</strong> ${cleanFromEmail}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Subject:</strong> ${cleanTitle}</p>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
                    <h4 style="margin: 0 0 15px 0; color: #333;">Message:</h4>
                    <p style="margin: 0; line-height: 1.6; color: #333; white-space: pre-wrap;">${cleanMessage}</p>
                </div>
            </div>
        `;

        // Create email parameters
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(`Contact Form: ${cleanTitle}`)
            .setText(emailText)
            .setHtml(emailHtml);

        console.log("About to send email...");

        // Send email
        await mailerSend.email.send(emailParams);

        console.log("Email sent successfully");

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Email sent successfully"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error sending email route:", error);

        // Log environment variable status
        console.error("MAILERSEND_API_KEY exists:", !!process.env.MAILERSEND_API_KEY);
        console.error("RECIPIENT_EMAIL:", process.env.RECIPIENT_EMAIL);
        console.error("SENDER_EMAIL:", process.env.SENDER_EMAIL);

        // Log more details for debugging
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        return NextResponse.json(
            {
                error: "Failed to send email. Please try again."
            },
            { status: 500 }
        );
    }
} 