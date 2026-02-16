const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000/api';

// Initialize WhatsApp Client
// Use LocalAuth to persist session so you don't rescan QR code every time
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

// Generate QR Code for authentication
client.on('qr', (qr) => {
    console.log('Use WhatsApp on your phone to scan this QR code:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

client.on('authenticated', () => {
    console.log('Authenticated successfully!');
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failure:', msg);
});

// Listen for incoming messages
client.on('message', async (msg) => {
    const chat = await msg.getChat();
    const sender = msg.from; // e.g. 1234567890@c.us
    const text = msg.body.trim();

    // Only respond to commands
    if (!text.toLowerCase().startsWith('!scan') && !text.toLowerCase().startsWith('!check')) return;

    // Remove command prefix
    const contentToAnalyze = text.replace(/^!(scan|check)\s*/i, '').trim();
    if (!contentToAnalyze) return msg.reply('Please provide text or a link to scan. Usage: !scan <text/url>');

    // Indicate processing
    chat.sendStateTyping();

    // Check if it's a URL
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(contentToAnalyze);

    try {
        let responseText = '';

        if (isUrl) {
            // Call Link Check API
            console.log(`Checking link from ${sender}: ${contentToAnalyze}`);
            const res = await axios.post(`${BACKEND_URL}/link/check/`, { url: contentToAnalyze });
            const data = res.data; // { risk_level, risk_score, red_flags, is_valid, ... }

            const emoji = data.risk_level === 'SAFE' ? '✅' :
                (data.risk_level === 'SUSPICIOUS' ? '⚠️' : '🚨');

            responseText = `*Link Analysis Report* ${emoji}\n\n` +
                `*Risk Level:* ${data.risk_level}\n` +
                `*Score:* ${data.risk_score}/100\n\n` +
                `*Details:*\n${(data.red_flags || []).map(f => `- ${f}`).join('\n') || 'No major flags.'}\n\n` +
                `_Stay safe with ScamShield!_`;

        } else {
            // Call Message Analysis API
            console.log(`Analyzing message from ${sender}: ${contentToAnalyze.substring(0, 50)}...`);
            const res = await axios.post(`${BACKEND_URL}/analyze/`, { message: contentToAnalyze });
            const data = res.data; // { risk_level, scam_score, red_flags, safety_tips, ... }

            const emoji = data.risk_level === 'SAFE' ? '✅' :
                (data.risk_level === 'SUSPICIOUS' ? '⚠️' : '🚨');

            responseText = `*Message Analysis Report* ${emoji}\n\n` +
                `*Risk Level:* ${data.risk_level}\n` +
                `*Score:* ${data.scam_score}/100\n\n` +
                `*Key Indicators:*\n${(data.red_flags || []).map(f => `- ${f}`).join('\n') || 'None detected.'}\n\n` +
                `*Safety Tips:*\n${(data.safety_tips || []).slice(0, 2).map(t => `- ${t}`).join('\n')}\n` +
                `_Stay safe with ScamShield!_`;
        }

        // Reply to the user
        await msg.reply(responseText);

    } catch (error) {
        console.error('Error processing message:', error.message);
        // creating error response
        // await msg.reply('⚠️ Error analyzing content. Please ensure the backend server is running.');
    } finally {
        chat.clearState();
    }
});

// Start the client
client.initialize();
