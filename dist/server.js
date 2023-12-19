"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var axios_1 = __importDefault(require("axios"));
var app = (0, express_1.default)();
var PORT = 3000;
var db = new sqlite3_1.default.Database('formData.db');
var WEBHOOK_URL = 'https://ubuffalo.webhook.office.com/webhookb2/810d040a-ed87-479d-9e72-5b2b121c970e@96464a8a-f8ed-40b1-99e2-5f6b50a20250/IncomingWebhook/139e53ada71442adad3b9c41e557845a/b5fd1f09-3709-4b2e-94b5-516af33606f0';
function sendTeamsNotification(data) {
    var message = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        "summary": "New Form Submission",
        "themeColor": "0078D7",
        "title": "New Form Submission Received!",
        "text": "Name: ".concat(data.$firstName, " ").concat(data.$lastName, "<br>Email: ").concat(data.$email, "<br>Favorite Editor: ").concat(data.$editor)
    };
    axios_1.default.post(WEBHOOK_URL, message)
        .then(function (response) {
        // handle response
    })
        .catch(function (error) {
        // handle error
    });
}
