import express from 'express';
import { getAuthUrl, getToken, setCredentials } from './auth/gmailAuth';
import { processEmail as processGmailEmail } from './services/gmailService';
import { getOutlookAuthUrl, getOutlookToken, verifyOutlookToken } from './auth/outlookAuth';
import { processEmail as processOutlookEmail } from './services/outlookEmailService';
import { emailQueue } from './config/queue';
import cron from 'node-cron';
import fs from 'fs';
import http from 'http';
import WebSocket from 'ws';
import axios from 'axios';
import puppeteer from 'puppeteer';

const app = express();
const port = 3000;
const server = http.createServer(app);

// File to store Gmail tokens
const TOKEN_PATH = './gmail-token.json';

// Load stored tokens from a file
const loadTokens = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    setCredentials(tokens);
    console.log('Tokens loaded from file.');
  } else {
    console.log('No stored tokens found.');
  }
};

// Save tokens to a file
const saveTokens = (tokens: any) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Tokens saved to file.');
};

// Schedule email processing every minute using cron
cron.schedule('* * * * *', async () => {
  console.log('Scheduling email processing job...');
  try {
    // Add a job to the queue
    await emailQueue.add('process-email', {});
  } catch (error) {
    console.error('Error scheduling email processing job:', error);
  }
});

// Endpoint to initiate manual authentication
app.get('/auth/gmail', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

// Callback to handle OAuth token exchange
app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const tokens = await getToken(code);
    setCredentials(tokens);
    saveTokens(tokens); // Save tokens for future use
    res.send('Gmail authentication successful!');
  } catch (error) {
    console.error('Gmail authentication failed:', error);
    res.status(500).send('Gmail authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/auth/outlook/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    console.log('Received auth code:', code);
    const token = await getOutlookToken(code);
    console.log('Token acquired successfully');
    res.send('Outlook authentication successful!');
  } catch (error) {
    console.error('Outlook authentication failed:', error);
    res.status(500).send('Outlook authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/verify-outlook-auth', async (req, res) => {
  try {
    const isAuthenticated = await verifyOutlookToken();
    if (isAuthenticated) {
      res.send('Outlook authentication is valid');
    } else {
      res.status(401).send('Outlook authentication is invalid or expired');
    }
  } catch (error) {
    console.error('Error verifying Outlook authentication:', error);
    res.status(500).send('Error verifying Outlook authentication: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/process-email/:provider', async (req, res) => {
  const provider = req.params.provider;

  try {
    let result;
    if (provider === 'gmail') {
      result = await processGmailEmail();
    } else if (provider === 'outlook') {
      const isAuthenticated = await verifyOutlookToken();
      if (!isAuthenticated) {
        throw new Error('Outlook authentication is invalid or expired');
      }
      result = await processOutlookEmail();
    } else {
      throw new Error('Invalid email provider');
    }
    res.send(result);
  } catch (error) {
    console.error('Error processing email:', error);
    res.status(500).send('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('WebSocket client connected');

  ws.on('message', (message: WebSocket.MessageEvent) => {
    console.log(`Received: ${message}`);
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  const checkForNewEmail = async () => {
    try {
      const response = await axios.get('http://localhost:3000/check-new-email');
      
      if (response.data.newEmail) {
        console.log('New email detected');
        await automateLogin();
        await categorizeEmail();
        ws.send(JSON.stringify({ status: 'Email processed successfully' }));
      } else {
        console.log('No new emails');
      }
    } catch (error) {
      console.error('Error checking for new email:', error);
    }
  };

  setInterval(checkForNewEmail, 60000);
});

const automateLogin = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/auth/gmail');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'pradyumna.p.6969@gmail.com');
    await page.click('#identifierNext');
    await page.waitForNavigation();
    console.log('Login successful');
    await browser.close();
  } catch (error) {
    console.error('Error during login automation:', error);
  }
};

const categorizeEmail = async () => {
  try {
    const response = await axios.post('http://localhost:3000/process-email/gmail');
    console.log('Email categorized:', response.data);
  } catch (error) {
    console.error('Error during email categorization:', error);
  }
};

// Start the server and load existing tokens
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  loadTokens();
  console.log('Automated email processing and WebSocket server are active.');
});
