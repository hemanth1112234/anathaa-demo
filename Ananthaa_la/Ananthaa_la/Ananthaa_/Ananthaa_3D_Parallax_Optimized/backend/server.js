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
const Booking = mongoose.model('Booking', BookingSchema, 'bookings');

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
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema, 'contacts');

app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, name, email, phone, subject, message } = req.body;

        // Normalise incoming payloads so both new and legacy clients store a name
        const fallbackName = (fullName || name || '').trim() || undefined;

        const payload = {
            fullName: fallbackName,
            name: fallbackName,
            email,
            phone,
            subject,
            message
        };

        const newMessage = new Contact(payload);
        await newMessage.save();
        console.log("📩 New Contact Message:", payload.subject);
        res.status(201).json({ message: "Message Sent Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 3. NEWSLETTER SUBSCRIPTION SYSTEM
// ==========================================
const NewsletterSchema = new mongoose.Schema({
    email: String,
    createdAt: { type: Date, default: Date.now }
});
const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', NewsletterSchema, 'newslettersubscribers');

app.post('/api/newsletter', async (req, res) => {
    try {
        const newSubscriber = new NewsletterSubscriber(req.body);
        await newSubscriber.save();
        console.log("📧 New Newsletter Subscriber:", req.body.email);
        res.status(201).json({ message: "Subscribed Successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 4. GET ENDPOINTS (Retrieve Data)
// ==========================================

// GET Bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const data = await Booking.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// GET Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await Contact.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// GET Newsletter Subscribers
app.get('/api/newsletter', async (req, res) => {
    try {
        const data = await NewsletterSubscriber.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

// ==========================================
// 5. DELETE ENDPOINTS (Remove from MongoDB)
// ==========================================

// Delete Booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        console.log("🗑️ Booking deleted:", req.params.id);
        res.status(200).json({ message: "Booking deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting booking" });
    }
});

// Delete Contact Message
app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        console.log("🗑️ Contact deleted:", req.params.id);
        res.status(200).json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting message" });
    }
});

// Delete Newsletter Subscriber
app.delete('/api/newsletter/:id', async (req, res) => {
    try {
        await NewsletterSubscriber.findByIdAndDelete(req.params.id);
        console.log("🗑️ Newsletter subscriber deleted:", req.params.id);
        res.status(200).json({ message: "Subscriber deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting subscriber" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
