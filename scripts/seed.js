// haadish-backend/scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../api/models/Post.js"; // ESM Post model path

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

const DATA = [
  // DoLine (2-line)
  { category: "DoLine", lines: ["دلِ ناداں تجھے ہوا کیا ہے؟", "آخر اس درد کی دوا کیا ہے؟"], author: "مرزا غالب", slug: "do-line-1" },
  { category: "DoLine", lines: ["ہم کو معلوم ہے جنت کی حقیقت لیکن", "دل کے خوش رکھنے کو غالب یہ خیال اچھا ہے"], author: "مرزا غالب", slug: "do-line-2" },

  // CharLine (4-line)
  { category: "CharLine", lines: ["گلشن میں پھروں کہ سیرِ صحرا دیکھوں", "یا معدن و کوه و دشت و دریا دیکھوں", "ہر جا تری قدرت کے ہیں لاکھوں جلوے", "حیران ہوں کہ دو آنکھوں سے کیا کیا دیکھوں"], author: "نظیر اکبر آبادی", slug: "char-line-1" },

  // Latifay (jokes)
  { category: "Latifay", body: "ایک استاد شاگرد سے: تم کل اسکول کیوں نہیں آئے تھے؟\nشاگرد: جی، میرے ابو نے کہا تھا کہ اگر تم فیل ہو گئے تو تمہاری ٹانگیں توڑ دوں گا۔\nاستاد: تو تم اس لیے نہیں آئے؟\nشاگرد: جی، میں کل اپنی ٹانگیں تڑوانے گیا تھا۔", slug: "latifay-1" },

  // Aqwal (quotes)
  { category: "Aqwal", body: "علم وہ نہیں جو آپ نے سیکھا ہے، علم تو وہ ہے جو آپ کے عمل و کردار سے ظاہر ہو۔", author: "امام غزالی", slug: "aqwal-1" },

  // Ghazal
  { category: "Ghazal", title: "کوئی امید بر نہیں آتی", author: "مرزا غالب", body: "کوئی امید بر نہیں آتی\nکوئی صورت نظر نہیں آتی", slug: "ghazal-1" },

  // Nazam (short example)
  { category: "Nazam", title: "نمونہ نظم", author: "نامعلوم", body: "یہ ایک نمونہ نظم ہے\nجو سمجھانے کے لیے رکھی گئی ہے", slug: "nazam-1" },

  // Naat / Hamd (religious)
  { category: "Naat", title: "درود و سلام", body: "السلام علیک یا رسول اللہ", author: "نامعلوم", slug: "naat-1" },
  { category: "Hamd", title: "حمدِ الٰہی", body: "سب تعریفیں اللہ کے لیے ہیں", author: "نامعلوم", slug: "hamd-1" },

  // Iqtibas (quotes/excerpts)
  { category: "Iqtibas", body: "زندگی ایک سفر ہے، منزل نہیں", author: "اقتباس", slug: "iqtibas-1" },

  // Sehat (health tip)
  { category: "Sehat", title: "صحت کی نصیحت", body: "روزانہ کم از کم تیس منٹ واک کریں", slug: "sehat-1" },

  // Maloomat (info)
  { category: "Maloomat", title: "حقائق", body: "دن میں کافی مقدار میں پانی پینا ضروری ہے", slug: "maloomat-1" },

  // Kitabein (books)
  { category: "Kitabein", title: "دیوانِ غالب", author: "مرزا غالب", coverImageUrl: "", downloadUrl: "#", previewUrl: "#", pages: 250, slug: "kitabein-g halib-1" }
];

// Connect and seed
async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for seeding...");

    // Optionally clear existing sample docs (UNCOMMENT if you want fresh)
    // await Post.deleteMany({}); 
    // console.log("Cleared existing Post collection.");

    // Insert only those that don't exist by slug (idempotent)
    for (const item of DATA) {
      if (!item.slug) {
        item.slug = (item.title || (item.lines && item.lines[0]) || Date.now().toString()).toString().toLowerCase().replace(/\s+/g, "-");
      }
      const existing = await Post.findOne({ slug: item.slug }).lean();
      if (!existing) {
        await Post.create(item);
        console.log("Inserted:", item.slug);
      } else {
        console.log("Already exists, skipped:", item.slug);
      }
    }

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
