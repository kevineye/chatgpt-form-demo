import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import axios from 'axios';

const app = express();
const PORT = 3000;
const db = new sqlite3.Database('formData.db');

const WEBHOOK_URL = 'https://ubuffalo.webhook.office.com/webhookb2/810d040a-ed87-479d-9e72-5b2b121c970e@96464a8a-f8ed-40b1-99e2-5f6b50a20250/IncomingWebhook/139e53ada71442adad3b9c41e557845a/b5fd1f09-3709-4b2e-94b5-516af33606f0';

function sendTeamsNotification(data: any) {
    const message = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": "New Form Submission",
        "themeColor": "0078D7",
        "title": "New Form Submission Received!",
        "text": `Name: ${data.$firstName} ${data.$lastName}<br>Email: ${data.$email}<br>Favorite Editor: ${data.$editor}`
    };

    axios.post(WEBHOOK_URL, message)
        .then(response => {
            console.log('Notification sent to MS Teams');
        })
        .catch(error => {
            console.error('Error sending notification to MS Teams:', error);
        });
}

// Middleware to parse POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Initialize the database
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS formData (firstName TEXT, lastName TEXT, email TEXT, editor TEXT)");
});

// Handle form submissions
app.post('/submit', (req: Request, res: Response) => {
    const data = {
        $firstName: req.body.firstName,
        $lastName: req.body.lastName,
        $email: req.body.email,
        $editor: req.body.editor
    };

    const sql = "INSERT INTO formData (firstName, lastName, email, editor) VALUES ($firstName, $lastName, $email, $editor)";
    
    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Saved data with ID: ${this.lastID}`);
        
        // Send notification to MS Teams
        sendTeamsNotification(data);

        res.send('Form submitted successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
