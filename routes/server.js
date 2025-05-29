const express = require('express');
const axios = require('axios');
const { WebSocketServer } = require('ws');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Haversine formula for distance calculation
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// OpenStreetMap Geocoding
async function geocodeCity(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        city
    )}&format=json&addressdetails=1&limit=1`;
    const response = await axios.get(url);
    if (response.data.length === 0) throw new Error('City not found');
    const { lat, lon } = response.data[0];
    return { lat: parseFloat(lat), lng: parseFloat(lon) };
}

// API: Check Distance
app.post('/check-distance', async (req, res) => {
    const { city, state, pincode } = req.body;
    const donorCity = 'Donor City'; // Example donor location

    try {
        const [userCoords, donorCoords] = await Promise.all([
            geocodeCity(`${city}, ${state}, ${pincode}`),
            geocodeCity(donorCity),
        ]);

        const distance = haversine(
            userCoords.lat,
            userCoords.lng,
            donorCoords.lat,
            donorCoords.lng
        );

        res.json({
            deliverable: distance <= 20,
            distance,
            userCoords,
            donorCoords,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket Server for Real-Time Tracking
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(data); // Broadcast location updates
            }
        });
    });
    ws.on('close', () => console.log('Client disconnected'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
