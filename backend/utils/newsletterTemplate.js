/**
 * An elegant, modern, and typographically-driven HTML newsletter template.
 * Designed to be beautiful without relying on images.
 * Uses inline CSS and tables for maximum email client compatibility.
 * @param {object} options
 * @param {string} options.recipientName - The personalized name of the recipient.
 * @param {string} options.subject - The email subject line (not used in the body here, but good practice to pass).
 * @param {string} options.htmlContent - The main body HTML from the TipTap editor.
 * @returns {string} The complete, styled HTML email content.
 */
const createNewsletterHtml = ({ recipientName, htmlContent }) => {
    // --- Configuration ---
    const siteUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const currentYear = new Date().getFullYear();
    const brandColor = '#E86E45'; // Your accent color
    const textColor = '#333D45'; // A soft, dark grey for text
    const backgroundColor = '#F9F7F5'; // A very light, warm off-white

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body { margin: 0; padding: 0; word-spacing: normal; background-color: ${backgroundColor}; }
            .wrapper { width: 100%; table-layout: fixed; }
            .main { max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: 'Montserrat', sans-serif; color: ${textColor}; border-spacing: 0; }
            .content { padding: 40px; }
            p { margin: 0 0 1.2em 0; line-height: 1.7; font-size: 16px; }
            a { color: ${brandColor}; text-decoration: none; }
            .button { display: inline-block; padding: 12px 30px; background-color: ${brandColor}; color: #ffffff !important; text-decoration: none; border-radius: 50px; font-weight: 600; letter-spacing: 0.5px; }
            .footer { padding: 40px; text-align: center; font-size: 12px; color: #909090; }
            .divider { padding: 20px 0; }
            .divider-line { height: 1px; background-color: #E2E8F0; width: 100px; margin: 0 auto; }
            /* --- Styles for TipTap-generated content --- */
            .user-content h3 { font-family: 'Playfair Display', serif; font-size: 24px; color: #2E2623; margin-top: 24px; margin-bottom: 8px; font-weight: 700; }
            .user-content ul, .user-content ol { padding-left: 20px; }
            .user-content li { margin-bottom: 10px; }
            .user-content blockquote { padding: 10px 20px; margin: 20px 0; border-left: 3px solid ${brandColor}; background-color: #FAF8F5; font-style: italic; }
        </style>
    </head>
    <body bgcolor="${backgroundColor}">
        <center class="wrapper">
            <table class="main" border="0" cellpadding="0" cellspacing="0">
                <!-- Header -->
                <tr>
                    <td style="padding: 40px; text-align: center;">
                        <h1 style="font-size: 36px; margin: 0; font-family: 'Playfair Display', serif; color: #2E2623; font-style: italic; font-weight: 600;">Fork & Fire</h1>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #7A6C66;">A collection of simple, delicious recipes.</p>
                    </td>
                </tr>

                <!-- Main Content -->
                <tr>
                    <td class="content">
                        <!-- Personalized Greeting -->
                        <p style="font-size: 18px;">Hi ${recipientName},</p>
                        
                        <!-- The TipTap HTML content gets injected here -->
                        <div class="user-content">${htmlContent}</div>
                        
                        <!-- Signature -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 40px;">
                            <tr>
                                <td style="padding-right: 15px;">
                                    <p style="margin: 0; line-height: 1; font-family: 'Playfair Display', serif; font-style: italic; font-size: 28px; color: ${brandColor};">Sugata</p>
                                </td>
                                <td>
                                    <p style="margin: 0; line-height: 1.4;">
                                        Happy Cooking, <br>
                                        <a href="${siteUrl}" style="font-size: 14px; text-decoration: underline;">from my kitchen to yours.</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Decorative Divider -->
                <tr>
                    <td class="divider">
                        <div class="divider-line"></div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td class="footer">
                        <p style="margin: 0 0 15px 0;">Follow along for more delicious content!</p>
                        <p style="margin: 0;">
                            <a href="#" style="padding: 0 10px; color: #909090;">Instagram</a> •
                            <a href="#" style="padding: 0 10px; color: #909090;">Pinterest</a> •
                            <a href="#" style="padding: 0 10px; color: #909090;">YouTube</a>
                        </p>
                        <p style="margin: 20px 0 0 0;">
                            © ${currentYear} Fork & Fire. All Rights Reserved. <br>
                            You are receiving this email because you subscribed to our newsletter.
                        </p>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    `;
};

module.exports = createNewsletterHtml;