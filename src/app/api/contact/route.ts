import { NextRequest, NextResponse } from "next/server";

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
 * Sends emails using MailerSend HTTP API (Edge-compatible)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fromEmail, title, message } = body;

        // Validate required fields
        if (!fromEmail || !title || !message) {
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
            return NextResponse.json(
                { error: "Invalid email address format" },
                { status: 400 }
            );
        }

        // Get environment variables
        const apiKey = process.env.MAILERSEND_API_KEY;
        const senderEmail = process.env.SENDER_EMAIL || "noreply@sbmi.io";
        const recipientEmail = process.env.RECIPIENT_EMAIL || "contact@sbmi.io";

        // Validate API key
        if (!apiKey) {
            return NextResponse.json(
                { error: "Email service configuration error" },
                { status: 500 }
            );
        }

        // Create email content with sender information in the body
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

        // Prepare email data for MailerSend HTTP API
        const emailData = {
            from: {
                email: senderEmail,
                name: "SBMI Contact Form"
            },
            to: [
                {
                    email: recipientEmail,
                    name: "SBMI Team"
                }
            ],
            subject: `Contact Form: ${cleanTitle}`,
            text: emailText,
            html: emailHtml
        };

        // Send email using MailerSend HTTP API
        const response = await fetch("https://api.mailersend.com/v1/email", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`MailerSend API error: ${response.status} - ${errorData.message || response.statusText}`);
        }

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