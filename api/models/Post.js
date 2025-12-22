// api/models/Post.js  (ESM)

import mongoose from "mongoose";

/* =========================================================
   1) ERAAB (Zabar, Zer, Pesh)
========================================================= */
const ERAAB = {
  "\u064E": "a",
  "\u0650": "i",
  "\u064F": "u",
};
const IGNORE_ERAAB = /[\u0651\u0652]/g;

/* =========================================================
   2) BASE CHARACTER MAP (و = w)
========================================================= */
const CHAR_MAP = {
  "ا":"a","آ":"aa","ب":"b","پ":"p","ت":"t","ٹ":"t","ث":"s",
  "ج":"j","چ":"ch","ح":"h","خ":"kh","د":"d","ڈ":"d","ذ":"z",
  "ر":"r","ڑ":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"z",
  "ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q",
  "ک":"k","گ":"g","ل":"l","م":"m","ن":"n","ں":"n",
  "و":"w","ہ":"h","ۃ":"h","ی":"y","ے":"e",
};

/* =========================================================
   3) WORD MAPS (AS REQUESTED + Mushaf)
========================================================= */

// COMMON WORDS
const COMMON_WORDS = {
  // tumhare diye hue lafz
  "ایک":"ek","رہے":"rahe","تھے":"thay","کہیں":"kaheen",
  "سائیکل":"cycle","تجھے":"tujhe","مجھے":"mujhe",
  "سانحہ":"saaneha","خطا":"khata","کھایا":"khaya",
  "رہے گا":"rahega","ذرا":"zara","آہستہ":"aahista",
  "چل":"chal","چلنا":"chalna","اپنی":"apni","میری":"meri",
  "تمہاری":"tumhari","ہماری":"humari","دونوں":"dono",
  "ہو":"ho","ہیں":"hain","کتنا":"kitna","مشکل":"mushkil",
  "آسان":"aasan","اذیت":"aziyyat","مہندی":"mehndi",
  "بیٹھے":"baithe","کھڑے":"khade","اٹھے":"uthe",
  "اس":"is","اُس":"us","تکبر":"takabbur",
  "غرور":"guroor","گھمنڈ":"ghamand",
  "سرد":"sard","گرم":"garm","نیند":"neend",
  "آوارگی":"awaargi","دوسروں":"dusron",
  "سننے":"sunne","سننا":"sunna",
  "ہی":"hi","کے":"ke","چائے":"chaay",
  "میں":"main","ورلڈ":"world","کپ":"cup",
  "چھوٹی":"choti","گھر":"ghar",
  "لڑکیاں":"larkiyan","لڑکیوں":"larkiyon",
  "تھا":"tha","سوچ":"soch",
  "نکلا":"nikla","نکلنا":"nikalna","نکلتا":"nikalta",
  "چاند":"chaand","مر":"mar","مرنا":"marna","مارنا":"maar­na",
  "دیار":"dayar","شوق":"shoq",
  "منظر":"manzar","منظروں":"manzaron",
  "اونچا":"ooncha","نیچا":"nicha",
  "گی":"gi","بیوی":"biwi","شوہر":"shohar",
  "بحث":"bahes","نانی":"nani","دادی":"dadi",
  "چاچی":"chachi","مامی":"mami","پھوپھی":"phoophi",
  "رانی":"rani","فنکشن":"function",
  "سمجھانا":"samjhana","سمجھانے":"samjhane",
  "سمجھاتے":"samjhate",
  "امی":"ammi","ابو":"abbu","بھائی":"bhai","بہن":"bahen",
  "جاگنا":"jaagna","جگانا":"jagaana",
  "چلانا":"chalana","چلا":"chala",
  "رات":"raat","دن":"din","راتیں":"raatein","راتوں":"raaton",
  "ہوں":"hon","بسر":"basar","یوں":"yun",
  "گزر":"guzar","گزار":"guzaar","گزارنا":"guzaarna","گزرنا":"guzarna",
  "تیرے":"tere","میرے":"mere",
  "رکھا":"rakha","رکھنا":"rakhna",
  "کوئی":"koi","سوئی":"soi","روئی":"roi","کھوئی":"khoi",
  "خود":"khud","چراغ":"chiraag",
  "فکر":"fikr","یقین":"yaqeen","یقیناً":"yaqeenan",
  "بجھا":"bujha","بوجھ":"bojh","بوجھا":"bojha",
  "سوتے":"sote","روتے":"rote","موٹے":"mote",
  "شمع":"shama","نصیب":"naseeb",
  "بھولا":"bhula","بھلانا":"bhulana","بھولنا":"bhoolna",
  "لازم":"laazim","حیات":"hayat","موت":"maut",
  "کو":"ko","کریں":"karen","سہن":"sahen",
  "شربت":"sharbat","ہلا":"hila","ہلانا":"hilana",
  "استعمال":"istemal",
  "نبی":"nabi","دوسرے":"dusre",
  "ہجوم":"hojoom","ضد":"zid",
  "آنکھوں":"aankhon","آنکھیں":"aankhen",
  "دنیا":"dunya","لیجیے":"lijiye",
  "ڈھونڈ":"dhoond","چھوڑنی":"chorni",
  "تیری":"teri",

  // 🔥 main ne khud se add kiye (likely to break)
  "بھی":"bhi","ہی":"hi","سے":"se","پر":"par",
  "کبھی":"kabhi","ہمیشہ":"hamesha",
  "بغیر":"baghair","شاید":"shayad",
  "لاکھ":"laakh","ہزار":"hazaar",
  "پل":"pal","لمحہ":"lamha","وقت":"waqt",
  "خواب":"khwaab","خاموشی":"khamoshi",
  "آواز":"awaaz","صدا":"sada",
  "یادیں":"yaadein","باتیں":"baatein",
  "تنہا":"tanha","تنہائی":"tanhai",
  "محفل":"mehfil","راہ":"raah",
};


// 3 HARFI
const WORDS_3 = {
  "سنگ":"sang","پیر":"peer","دل":"dil","غم":"gham","درد":"dard",
  "راہ":"rah","بات":"baat","نور":"noor","وقت":"waqt","راز":"raaz",
  "خوف":"khauf","حق":"haq","علم":"ilm","نظر":"nazar","سفر":"safar",
  "زخم":"zakhm","صبح":"subah","شام":"shaam","رات":"raat","دن":"din",
  "یاد":"yaad","حال":"haal","نام":"naam","کام":"kaam","چاہ":"chah",
  "اور":"aur","پر":"par","سے":"se","تک":"tak","بعد":"baad",
};

// 4 HARFI
const WORDS_4 = {
  "محبت":"mohabbat","نفرت":"nafrat","زندگی":"zindagi","خاموش":"khamosh",
  "انداز":"andaaz","دوستی":"dosti","یقین":"yaqeen","امید":"umeed",
  "خواہش":"khwahish","عبادت":"ibadat","عدالت":"adalat",
  "مسجد":"masjid","جنت":"jannat","جہنم":"jahannum",
  "نماز":"namaz","روشن":"roshan","اندھیرا":"andhera",
  "چہرہ":"chehra","خیال":"khayal","احساس":"ehsaas",
  "سکون":"sukoon","پیار":"pyaar","کہانی":"kahani",
  "قسمت":"qismat","رحمت":"rehmat","ہدایت":"hidayat",
};

// BOOKS / NOVELS (+ Mushaf added)
const BOOKS = {
  "نمل":"namal",
  "پیر کامل":"peer-e-kamil",
  "قرآنِ کامل":"quran-e-kamil",
  "مشاف":"mushaf",
  "مصحف":"mushaf",
  "خالق":"khaliq",
  "دجال":"dajjal",
  "جنت کے پتے":"jannat-ke-pattay",
  "جو بچیں ہیں سنگ سمیٹ لو":"jo-bachay-hain-sang-samet-lo",
  "خدا اور محبت":"khuda-aur-mohabbat",
  "راجہ گدھ":"raja-gidh",
  "آنگن":"aangan",
  "آگ کا دریا":"aag-ka-darya",
  "اداس نسلیں":"udaas-naslein",
  "خدا کی بستی":"khuda-ki-basti",
  "من چلے کا سودا":"man-chalay-ka-sauda",
  "امراؤ جان ادا":"umrao-jan-ada",
  "ہم سفر":"hum-safar",
  "شہاب نامہ":"shahab-nama",
  "بستی":"basti",
};

/* =========================================================
   4) HELPERS
========================================================= */
function isNumericSlug(slug = "") {
  return /^\d+$/.test(slug);
}

function transliterateWord(word) {
  let out = "";
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const next = word[i + 1];

    if (CHAR_MAP[ch] && ERAAB[next]) {
      out += CHAR_MAP[ch] + ERAAB[next];
      i++;
      continue;
    }
    if (CHAR_MAP[ch]) {
      out += CHAR_MAP[ch];
      continue;
    }
    if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch.toLowerCase();
    }
  }
  return out;
}

function transliterate(text = "") {
  text = String(text).replace(IGNORE_ERAAB, "");
  const words = text.split(/\s+/);
  let out = "";

  for (const w of words) {
    if (BOOKS[w]) { out += BOOKS[w] + " "; continue; }
    if (COMMON_WORDS[w]) { out += COMMON_WORDS[w] + " "; continue; }
    if (WORDS_4[w]) { out += WORDS_4[w] + " "; continue; }
    if (WORDS_3[w]) { out += WORDS_3[w] + " "; continue; }
    out += transliterateWord(w) + " ";
  }

  return out
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeSlug(text = "") {
  let slug = transliterate(text)
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug || slug.length < 3) slug = "urdu-post";
  return slug.slice(0, 80);
}

/* =========================================================
   5) SCHEMA
========================================================= */
const PostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    author: { type: String },
    createdAt: { type: Date, default: Date.now },

    lines: [{ type: String }],
    body: { type: String },

    title: { type: String },
    coverImageUrl: { type: String },
    downloadUrl: { type: String },
    previewUrl: { type: String },
    pages: { type: Number },

    slug: { type: String, lowercase: true, trim: true },

    headerImageUrl: { type: String },
    bodyImageUrl1: { type: String },
    bodyImageUrl2: { type: String },
    bodyImageUrl3: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: false }
);

/* =========================================================
   6) AUTO SLUG GENERATION (🔥 CORE FIX)
========================================================= */
PostSchema.pre("save", function (next) {
  if (!this.slug || this.slug.trim() === "" || isNumericSlug(this.slug)) {
    const base =
      this.title ||
      (this.lines && this.lines[0]) ||
      this.body?.slice(0, 60) ||
      "urdu-post";

    this.slug = makeSlug(base);
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
