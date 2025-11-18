// api/server.js (ESM) — production-safe CORS + preflight
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import postsRoute from './routes/posts.js';
import adminAuthRoute from './routes/adminAuth.js';

const app = express();

// === Allowed Origins ===
const allowedOrigins = [
  'http://localhost:3000',        // Development frontend
  'https://www.haadish.site',     // LIVE domain
  'http://www.haadish.site'       // In case non-https access
];

// Enable CORS (production safe)
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS blocked: ' + origin), false);
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Preflight safe
app.options('*', cors());

// Body parser
app.use(express.json());

// Admin Auth Route (correct position here)
app.use('/api/admin', adminAuthRoute);

// Posts Route
app.use('/api/posts', postsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
}
