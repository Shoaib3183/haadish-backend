// api/routes/posts.js  (ESM)

import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

/* =========================================================
   NOTE:
   Slug generation logic is CENTRALIZED in Post.js (model)
   posts.js will NOT generate slug by itself.
========================================================= */




// ---------------------- ROUTES ----------------------

// GET paginated by category
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    if (!category) return res.status(400).json({ error: 'category required' });

    const qPage = Math.max(1, parseInt(page));
    const qLimit = Math.max(1, parseInt(limit));

    const filter = { category };
    const total = await Post.countDocuments(filter);
    const totalPages = Math.ceil(total / qLimit);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((qPage - 1) * qLimit)
      .limit(qLimit)
      .lean();

    res.json({ posts, totalPages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET all by category
router.get('/all', async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) return res.status(400).json({ error: 'category required' });

    const posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET single by id or slug
router.get('/single', async (req, res) => {
  try {
    const { id, slug } = req.query;
    let post = null;

    if (id) {
      post = await Post.findById(id).lean();
    } else if (slug) {
      post = await Post.findOne({ slug }).lean();
    } else {
      return res.status(400).json({ error: 'Provide id or slug' });
    }

    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// SEARCH
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');

    const posts = await Post.find({
      $or: [
        { title: regex },
        { body: regex },
        { author: regex },
        { lines: { $elemMatch: { $regex: regex } } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CREATE  ✅ (slug handled by Post.js middleware)
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };

    // Image normalization
    payload.headerImageUrl =
      payload.headerImageUrl ||
      payload.headerImage ||
      payload.imageUrl ||
      payload.imageURL ||
      payload.image ||
      null;

    payload.bodyImageUrl1 =
      payload.bodyImageUrl1 ||
      payload.bodyImage1 ||
      payload.bodyImage ||
      null;

    payload.bodyImageUrl2 =
      payload.bodyImageUrl2 ||
      payload.bodyImage2 ||
      null;

    payload.bodyImageUrl3 =
      payload.bodyImageUrl3 ||
      payload.bodyImage3 ||
      null;

    payload.coverImageUrl =
      payload.coverImageUrl || payload.headerImageUrl || null;

    // ❌ No slug logic here
    // ✅ Post.js will auto-generate slug (eraab + word maps)

    const post = new Post(payload);
    await post.save();

    res.status(201).json(post);

  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate key error',
        details: err.keyValue
      });
    }
    res.status(500).json({ error: err.message });
  }
});


// UPDATE  ✅ (slug auto-fix handled by Post.js)
router.put('/:id', async (req, res) => {
  try {
    const payload = { ...req.body };

    // Image normalization
    payload.headerImageUrl =
      payload.headerImageUrl ||
      payload.headerImage ||
      payload.imageUrl ||
      payload.imageURL ||
      payload.image ||
      null;

    payload.bodyImageUrl1 =
      payload.bodyImageUrl1 ||
      payload.bodyImage1 ||
      payload.bodyImage ||
      null;

    payload.bodyImageUrl2 =
      payload.bodyImageUrl2 ||
      payload.bodyImage2 ||
      null;

    payload.bodyImageUrl3 =
      payload.bodyImageUrl3 ||
      payload.bodyImage3 ||
      null;

    payload.coverImageUrl =
      payload.coverImageUrl || payload.headerImageUrl || null;

    // ❌ No slug rebuild logic here
    // ✅ Post.js middleware will fix empty / numeric slug

    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Post.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// CHECK DUPLICATE
router.post('/check-duplicate', async (req, res) => {
  try {
    const { category, identifier, excludeId } = req.body;
    if (!category || !identifier)
      return res.status(400).json({ error: 'category and identifier required' });

    let filter = { category };

    if (['DoLine', 'CharLine'].includes(category)) {
      filter['lines.0'] = identifier;
    } else if (['Latifay', 'Aqwal'].includes(category)) {
      filter['body'] = { $regex: '^' + escapeRegExp(identifier), $options: 'i' };
    } else {
      filter['title'] = identifier;
    }

    if (excludeId) filter._id = { $ne: excludeId };

    const found = await Post.findOne(filter).lean();
    res.json({ duplicate: !!found });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default router;
