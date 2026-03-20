const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database Configuration
const dbURI = 'mongodb://localhost:27017/interviewBooking';  // Change this to your database URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));

// Mongoose Schema for Booked Slots
const bookedSlotSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: Date,
  time: String
});

const BookedSlot = mongoose.model('BookedSlot', bookedSlotSchema);

// API Endpoints
// Book a Slot
app.post('/book-slot', async (req, res) => {
  const { name, email, date, time } = req.body;

  const newSlot = new BookedSlot({ name, email, date, time });
  try {
    await newSlot.save();
    res.status(201).send('Slot booked successfully!');
  } catch (error) {
    res.status(500).send('Error booking slot: ' + error.message);
  }
});

// Get Booked Slots
app.get('/booked-slots', async (req, res) => {
  try {
    const slots = await BookedSlot.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).send('Error fetching booked slots: ' + error.message);
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
