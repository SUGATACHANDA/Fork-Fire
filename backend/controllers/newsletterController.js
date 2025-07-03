const asyncHandler = require('express-async-handler');
const Newsletter = require('../models/newsletterModel.js');
const User = require('../models/userModel.js');
const sendEmail = require('../utils/sendMail.js') // Import User model for an edge case
const createNewsletterHtml = require('../utils/newsletterTemplate.js');

// @desc    Subscribe to the newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // 1. Basic Validation
    if (!email) {
        res.status(400); // Bad Request
        throw new Error('Email is required.');
    }

    // 2. Check if the email is already in the newsletter list
    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
        // We don't throw an error here. It's better UX to just confirm their subscription.
        res.status(200).json({ message: 'You are already subscribed to our newsletter. Thank you!' });
        return;
    }

    // 3. Check if this email belongs to a registered user
    const user = await User.findOne({ email });
    if (user && !user.newsletter) {
        // If the user exists but isn't marked as subscribed, update their profile.
        user.newsletter = true;
        await user.save();
    }

    // 4. Create the new subscription record
    await Newsletter.create({ email });

    res.status(201).json({ message: 'Thank you for subscribing to our newsletter!' });
});

const sendNewsletter = asyncHandler(async (req, res) => {
    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
        res.status(400); throw new Error('Subject and content are required.');
    }

    const subscribers = await Newsletter.find({}, 'email');
    if (subscribers.length === 0) {
        res.status(404); throw new Error('No subscribers found.');
    }
    const subscriberEmails = subscribers.map(sub => sub.email);

    const users = await User.find({ email: { $in: subscriberEmails } }, 'name email');
    const userMap = new Map(users.map(user => [user.email, user.name]));

    const emailPromises = [];
    let successfulSends = 0;

    for (const email of subscriberEmails) {
        const name = userMap.get(email);
        // Use "Food Lover" as a friendly fallback for subscribers who aren't registered users
        const firstName = name ? name.split(' ')[0] : 'Food Lover';

        // --- THE KEY CHANGE IS HERE ---
        // 2. Create the full, styled HTML using our template function
        const finalHtml = createNewsletterHtml({
            recipientName: firstName,
            subject: subject,
            htmlContent: htmlContent, // This is the content from the admin's TipTap editor
        });

        // 3. Send the complete HTML in the email
        emailPromises.push(
            sendEmail({
                to: email,
                subject: subject,
                html: finalHtml, // Send the final template, not the raw content
            }).catch(error => ({ status: 'failed', reason: error.message }))
        );
    }

    const results = await Promise.allSettled(emailPromises);
    results.forEach(result => {
        if (result.status === 'fulfilled' && !result.value?.status) {
            successfulSends++;
        }
    });

    if (successfulSends < results.length) {
        res.status(207).json({ message: `Newsletter dispatch completed. ${successfulSends} sent successfully, ${results.length - successfulSends} failed.` });
    } else {
        res.status(200).json({ message: `Newsletter sent successfully to all ${successfulSends} subscribers.` });
    }
});

module.exports = {
    subscribeToNewsletter,
    sendNewsletter
};