const express = require('express');
const router = express.Router();
const { SessionsClient } = require('@google-cloud/dialogflow');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const sessionClient = new SessionsClient({
  keyFilename: path.join(__dirname, '../serviceAccountKey.json'),
});

const projectId = 'analog-crossing-453506';
const sessionId = uuidv4(); // Dynamic session ID for each session
const languageCode = 'en';

router.post('/chatbot', async (req, res) => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode,
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
router.get('/chatbot', (req, res) => {
    res.render('chatbot'); // Ensure chatbot.ejs exists in the 'views' folder
  });
  
module.exports = router;
