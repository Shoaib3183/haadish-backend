import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import postsRoute from './routes/posts.js';
import adminAuthRoute from './routes/adminAuth.js';

const app = express();

// === Allowed Origins ===
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.haadish.site',
  'http://www.haadish.site'
];

// Enable CORS
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: ' + origin), false);
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Preflight
app.options('*', cors());

// Body Parser
app.use(express.json());

// API Routes only
app.use('/api/admin', adminAuthRoute);
app.use('/api/posts', postsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
