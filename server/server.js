// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const URL = mongoose.model('URL', urlSchema);

// Routes

// Create Short URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortCode = customCode || Math.random().toString(36).substring(2, 8);

    const existing = await URL.findOne({ shortCode });
    if (existing) {
      return res.status(409).json({ error: 'Short code already exists' });
    }

    const newUrl = new URL({ originalUrl, shortCode });
    await newUrl.save();

    res.status(201).json({
      message: 'Short URL created successfully',
      data: {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Retrieve Original URL
app.get('/api/url/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findOne({ shortCode });

    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    res.json({
      message: 'URL retrieved successfully',
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update Short URL
app.put('/api/url/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl } = req.body;

    if (!originalUrl) return res.status(400).json({ error: 'New original URL is required' });

    const url = await URL.findOneAndUpdate(
      { shortCode },
      { originalUrl, updatedAt: Date.now() },
      { new: true }
    );

    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    res.json({
      message: 'URL updated successfully',
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Delete Short URL
app.delete('/api/url/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findOneAndDelete({ shortCode });

    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    res.json({ message: 'URL deleted successfully', data: { shortCode } });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get Statistics
app.get('/api/stats/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await URL.findOne({ shortCode });

    if (!url) return res.status(404).json({ error: 'Short URL not found' });

    res.json({
      message: 'Statistics retrieved successfully',
      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Redirect to Original URL
app.get('/r/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find and increment click count
    const url = await URL.findOneAndUpdate(
      { shortCode },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).send('❌ Short URL not found');
    }

    // Ensure valid protocol (avoids broken redirects)
    let redirectUrl = url.originalUrl;
    if (!/^https?:\/\//i.test(redirectUrl)) {
      redirectUrl = 'https://' + redirectUrl;
    }

    // Redirect to the destination
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('⚠️ Server error during redirect');
  }
});

// Get All URLs
app.get('/api/urls', async (req, res) => {
  try {
    const urls = await URL.find().sort({ createdAt: -1 });
    res.json({ message: 'All URLs retrieved successfully', count: urls.length, data: urls });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));