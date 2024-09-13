## Overview

A Node.js application automates email management for both Gmail and Outlook, using GPT-3.5 Turbo-0125 to categorize incoming emails, generate suitable replies, and automatically apply labels or categories. It features AI-powered email categorization, OAuth2 authentication for secure access, and real-time automation via a WebSocket server. BullMQ and Redis are used for efficient task queuing and processing.


## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Gmail account 
- Microsoft Azure account with registered application 
- OpenAI API key
- Docker

## Configuration

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

## API Endpoints

- `/auth/gmail`: Initiates Gmail authentication
- `/auth/outlook`: Initiates Outlook authentication
- `/process-email/gmail`: Processes the latest unread Gmail email
- `/process-email/outlook`: Processes the latest unread Outlook email

## Run using npm start
All these are done automatically by web socket server.