const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'medicine' },
    status: { type: String, enum: ['taken', 'skipped'], default: 'taken' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('log', LogSchema);
