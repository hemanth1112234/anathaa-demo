require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// 1. BOOKING SYSTEM (For "Book a Site Visit")
// ==========================================
const BookingSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    date: String,
    timeSlot: String,
    createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', BookingSchema);

app.post('/api/book-visit', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        console.log("📅 New Booking:", req.body.fullName);
        res.status(201).json({ message: "Booking Confirmed!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 2. CONTACT SYSTEM (For "Send us a Message")
// ==========================================
const ContactSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        console.log("📩 New Contact Message:", req.body.subject);
        res.status(201).json({ message: "Message Sent Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));