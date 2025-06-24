"use client";

import { useState } from "react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ContactModal component that displays a form for sending contact emails
 * @param isOpen - Boolean indicating if the modal is open
 * @param onClose - Function to call when closing the modal
 */
const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [fromEmail, setFromEmail] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    /**
     * Handles the form submission by sending an email via API
     */
    const handleSubmit = async (): Promise<void> => {
        if (!fromEmail.trim() || !title.trim() || !message.trim()) {
            alert("Please fill in all fields (from email, subject, and message).");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fromEmail.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsSending(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fromEmail: fromEmail.trim(),
                    title: title.trim(),
                    message: message.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success - show success message and close modal
                alert("Email sent successfully! We'll get back to you soon.");
                setFromEmail("");
                setTitle("");
                setMessage("");
                onClose();
            } else {
                // Error from server
                throw new Error(data.error || "Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("There was an error sending the email. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    /**
     * Handles the escape key press to close the modal
     */
    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    // Don't render if modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div
                className="bg-white text-black rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with X button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Contact Us</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    {/* From email input */}
                    <div className="mb-4">
                        <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Email *
                        </label>
                        <input
                            type="email"
                            id="fromEmail"
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                            placeholder="Enter your email address..."
                            required
                        />
                    </div>

                    {/* Title input */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                            placeholder="Enter subject..."
                            required
                        />
                    </div>

                    {/* Message textarea */}
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-vertical"
                            placeholder="Enter your message..."
                            required
                        />
                    </div>

                    {/* Send button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSending}
                            className="bg-gold text-black py-2 px-6 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactModal; 