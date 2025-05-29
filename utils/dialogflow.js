const dialogflow = require('dialogflow');
const fs = require('fs');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: path.join(__dirname, '../serviceAccountKey.json'),
});

const detectIntent = async (text, sessionId) => {
    const sessionPath = sessionClient.sessionPath('YOUR_PROJECT_ID', sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: text,
                languageCode: 'en',
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0].queryResult;
};

module.exports = { detectIntent };
