import express from 'express';
import { getAuthUrl, getToken, setCredentials } from './auth/gmailAuth';
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

const saveTokens = (tokens: any) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
   console.log('Tokens saved to file.');
};

// Schedule email processing every minute using cron
cron.schedule('* * * * *', async () => {
  // console.log('Scheduling email processing job...');
  try {
    await emailQueue.add('process-email', {});
  } catch (error) {
  }
});

app.get('/auth/gmail', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const tokens = await getToken(code);
    setCredentials(tokens);
    saveTokens(tokens); 
    res.send('Gmail authentication successful!');
  } catch (error) {
    console.error('Gmail authentication failed:', error);
    res.status(500).send('Gmail authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
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