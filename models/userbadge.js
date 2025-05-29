const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    badge: {
        type: String,
        enum: ["Gold", "Silver", "Bronze", "None"], // Possible badge types
        default: "None"
    },
    assignedAt: {
        type: Date,
        default: Date.now
    }
});

const UserBadge = mongoose.model('UserBadge', userBadgeSchema);
module.exports = UserBadge;
