# Pradyumna's-Reachinbox Backend Assessment

## Overview
A Node.js application for automating email management in both Gmail and Outlook, utilizing GPT-3.5 turbo-0125. It categorizes incoming emails, generates suitable replies, and applies labels or categories to the processed emails automatically.

## Features
- Compatible with both Gmail and Outlook email platforms
- AI-powered email categorization
- Automatically generates appropriate email replies
- Assigns labels and organizes emails based on categories
- Implemented a WebSocket server for real-time automation
- OAuth2 authentication for secure access to email accounts
- Utilized BullMQ and Redis for efficient task queuing and processing

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Gmail account 
- Microsoft Azure account with registered application 
- OpenAI API key
- Docker

## Folder Structure
```bash
pradyumna/
├── src/
│   ├── app.ts
│   ├── config/
│   │   ├── config.ts
│   │   └── queue.ts
│   ├── auth/
│   │   ├── gmailAuth.ts
│   │   └── outlookAuth.ts
│   ├── services/
│   │   ├── aiService.ts
│   │   ├── gmailService.ts
│   │   └── outlookEmailService.ts
├── .env
├── .gitignore
├── gmail-token.json
├── mail\ bot\ setup.md
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-email-assistant.git
   cd ai-email-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   # Gmail Configuration
   GMAIL_CLIENT_ID=your_gmail_client_id
   GMAIL_CLIENT_SECRET=your_gmail_client_secret
   GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback

   # Outlook Configuration
   OUTLOOK_CLIENT_ID=your_outlook_client_id
   OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
   OUTLOOK_TENANT_ID=your_outlook_tenant_id
   OUTLOOK_REDIRECT_URI=http://localhost:3000/auth/outlook/callback

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Redis COnfiguration
   REDIS_PORT = 6379
   REDIS_HOST = 127.0.0.1
   REDIS_PASS = your_password
   ```

4. Configure OAuth 2.0 credentials:
   - For Gmail: Set up OAuth 2.0 credentials in the Google Cloud Console
   - For Outlook: Register an application in the Azure Portal and configure the necessary permissions

## Usage

1. Start the server:
   ```
   npm start
   ```

2. Authenticate your email accounts:
   - Gmail: Visit `http://localhost:3000/auth/gmail` or `http://localhost:3000/auth`
   - Outlook: Visit `http://localhost:3000/auth/outlook`
   - It is a one time process

3. Process emails:
   - Gmail: `http://localhost:3000/process-email/gmail`
   - Outlook: `http://localhost:3000/process-email/outlook`

4. step 2 and 3 will done automatically by the web socket once the refresh token is generated.

## API Endpoints

- `/auth/gmail`: Initiates Gmail authentication
- `/auth/outlook`: Initiates Outlook authentication
- `/process-email/gmail`: Processes the latest unread Gmail email
- `/process-email/outlook`: Processes the latest unread Outlook email
- `/verify-outlook-auth`: Verifies Outlook authentication status

