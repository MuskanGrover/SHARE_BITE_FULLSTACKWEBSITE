const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const router = express.Router();

// Validate PayPal environment variables
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal Client ID or Secret in environment variables');
}

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Middleware to handle JSON payloads
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Route to create a PayPal order
router.post('/create-paypal-order', async (req, res) => {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({ error: 'Invalid or missing donation amount' });
    }

    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amount,
                    },
                },
            ],
        });

        const order = await client.execute(request);

        if (!order || !order.result || !order.result.id) {
            return res.status(500).json({ error: 'PayPal API did not return a valid order ID' });
        }

        res.status(200).json({ orderID: order.result.id });
    } catch (error) {
        console.error('Error creating PayPal order:', error.message);
        res.status(500).json({ error: 'Failed to create PayPal order' });
    }
});

// Route to capture the payment after approval
router.post('/capture-paypal-payment', async (req, res) => {
    const { orderID } = req.body;

    if (!orderID) {
        return res.status(400).json({ error: 'Missing order ID' });
    }

    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const capture = await client.execute(request);

        if (capture.result.status === 'COMPLETED') {
            res.status(200).json({ message: 'Payment successful!' });
        } else {
            res.status(500).json({ message: 'Payment failed.' });
        }
    } catch (error) {
        console.error('Error capturing PayPal payment:', error.message);
        res.status(500).json({ error: 'Failed to capture PayPal payment' });
    }
});

module.exports = router;
