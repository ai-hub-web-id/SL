// api/resolve-shortlink.js
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

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { shortCode } = req.query;

    try {
      const doc = await db.collection('shortlinks').doc(shortCode).get();

      if (doc.exists) {
        const data = doc.data();
        res.redirect(301, data.full);
      } else {
        res.status(404).json({ error: 'Shortlink not found!' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error resolving shortlink: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
