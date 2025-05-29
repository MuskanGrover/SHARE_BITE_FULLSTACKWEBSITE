const { detectIntent } = require('../utils/dialogflow');
const Location = require('../models/Location');

const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    try {
        const response = await detectIntent(message, userId);

        // If intent is "find_nearby", return nearby donors
        if (response.action === 'find_nearby') {
            const donors = await Location.find({ role: 'donor' });
            const donorList = donors.map((donor) => donor.userId).join(', ');

            res.json({ reply: `Nearby donors are: ${donorList}` });
        } 
        
        // If intent is "request_food", filter based on food type
        else if (response.action === 'request_food') {
            const foodType = response.parameters.fields.food.stringValue;
            const donors = await Location.find({ role: 'donor' });

            const availableFood = donors
                .filter(donor => donor.foodType === foodType)
                .map(donor => donor.userId)
                .join(', ');

            res.json({ reply: availableFood ? `Available ${foodType} donors: ${availableFood}` : `No ${foodType} options nearby.` });
        } 
        
        else {
            res.json({ reply: response.fulfillmentText });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing message' });
    }
};

module.exports = { handleChat };
