// api/create-shortlink.js
const admin = require("firebase-admin");

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "ai-hub-50a0b",
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: "firebase-adminsdk@ai-hub-50a0b.iam.gserviceaccount.com",
    }),
  });
}

const db = admin.firestore();

// Fungsi untuk membuat kode shortlink acak
function generateShortCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { fullUrl } = req.body;
    const shortCode = generateShortCode();

    try {
      // Simpan shortlink ke Firestore
      await db.collection('shortlinks').doc(shortCode).set({
        full: fullUrl,
        short: shortCode
      });

      // Kirimkan shortlink sebagai respon
      res.status(200).json({ shortlink: `https://www.ai-hub.web.id/${shortCode}` });
    } catch (error) {
      res.status(500).json({ error: 'Error generating shortlink: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
