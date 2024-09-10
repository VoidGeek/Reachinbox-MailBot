# Email Automation Setup and Testing Guide

## 1. Environment Setup

1. Ensure you have Node.js and npm installed on your system.

2. Install the required dependencies:
   ```
   npm install express dotenv googleapis openai @azure/msal-node @microsoft/microsoft-graph-client @azure/identity
   ```

3. Set up your `.env` file in the project root with all necessary credentials:
   ```
   GMAIL_CLIENT_ID=your_gmail_client_id
   GMAIL_CLIENT_SECRET=your_gmail_client_secret
   GMAIL_REDIRECT_URI=http://localhost:3000/auth/gmail/callback
   OPENAI_API_KEY=your_openai_api_key
   OUTLOOK_CLIENT_ID=your_outlook_client_id
   OUTLOOK_CLIENT_SECRET=your_outlook_client_secret
   OUTLOOK_REDIRECT_URI=http://localhost:3000/auth/outlook/callback
   OUTLOOK_TENANT_ID=your_outlook_tenant_id
   ```

## 2. Running the Application

1. Start your application:
   ```
   node app.js
   ```
   (Or use `nodemon app.js` for development)

2. Your server should now be running on `http://localhost:3000`

## 3. Testing Gmail Functionality

1. Gmail Authentication:
   - Open a browser and go to `http://localhost:3000/auth`
   - You should be redirected to Google's login page
   - After successful login, you should see "Authentication successful!"

2. Process Gmail Email:
   - Send a test email to the Gmail account you've set up
   - Make a GET request to `http://localhost:3000/process-email/gmail`
   - Check the console for processing logs
   - Verify that a response email was sent and the original email was labeled

## 4. Testing Outlook Functionality

1. Outlook Authentication:
   - Open a browser and go to `http://localhost:3000/auth/outlook`
   - You should be redirected to Microsoft's login page
   - After successful login, you should see "Outlook authentication successful!"

2. Process Outlook Email:
   - Send a test email to the Outlook account you've set up
   - Make a GET request to `http://localhost:3000/process-email/outlook`
   - Check the console for processing logs
   - Verify that a response email was sent and the original email was categorized

## 5. Testing AI Functionality

1. Email Categorization:
   - Check the console logs during email processing
   - Verify that emails are being categorized correctly

2. Response Generation:
   - Review the automated responses sent by the system
   - Ensure they are contextually appropriate and professional

## 6. Error Handling and Edge Cases

1. Invalid Email Provider:
   - Make a GET request to `http://localhost:3000/process-email/invalid`
   - Verify that you receive an appropriate error response

2. No Unread Emails:
   - Process emails when there are no unread messages
   - Verify that the system handles this gracefully

3. Authentication Errors:
   - Try to process emails without proper authentication
   - Ensure the system provides appropriate error messages

## 7. Performance Testing

1. Multiple Emails:
   - Send multiple emails to both Gmail and Outlook accounts
   - Process them in quick succession
   - Monitor system performance and response times

2. Large Emails:
   - Send emails with large bodies or attachments
   - Verify that the system can handle them without timing out

## 8. Security Testing

1. Token Storage:
   - Verify that access tokens are being stored securely
   - Ensure they are not exposed in logs or responses

2. Rate Limiting:
   - Implement and test rate limiting to prevent abuse of your API endpoints

3. Input Validation:
   - Test with various types of malformed input to ensure proper validation and sanitization

Remember to monitor your API usage for both Gmail API, Microsoft Graph API, and OpenAI API to avoid exceeding quotas or incurring unexpected costs.
