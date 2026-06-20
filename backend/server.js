import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import pkg from 'cloudinary'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // Added password cryptography engine

const { v2: cloudinary } = pkg; 

// Initialize environment variables configuration footprints
dotenv.config();

const app = express();

// Set high limits so raw file strings process cleanly during drag/drop operations
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Initialize Neon Database SQL Driver Connection Cluster
const sql = neon(process.env.DATABASE_URL);

// Configure Cloudinary Global Media Credentials Matrix
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

try {
  const result = await sql`SELECT NOW()`;
  console.log('✅ Neon connected:', result);
} catch (err) {
  console.error('❌ Neon connection failed:', err.message);
}

// --- REUSABLE STORAGE INTERCEPTOR UTILITY ---
async function handleImageStorage(imageInput) {
  if (!imageInput || !imageInput.startsWith('data:image')) {
    return imageInput;
  }
  try {
    const uploadResult = await cloudinary.uploader.upload(imageInput, {
      folder: 'chayamba_cms_assets',
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error('Cloudinary media injection intercept crash:', error);
    throw new Error('Failed to pipeline image upload to Cloudinary storage.');
  }
}

// ==========================================
//   SYSTEM API ENDPOINTS
// ==========================================

// --- [NEWS ROUTING LAYER] ---
app.get('/api/news', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM news ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/news', async (req, res) => {
  try {
    const { category, title, date_string, author, content, image } = req.body;
    const targetImageUrl = await handleImageStorage(image);

    const [inserted] = await sql`
      INSERT INTO news (category, title, date_string, author, content, image)
      VALUES (${category}, ${title}, ${date_string}, ${author}, ${content}, ${targetImageUrl})
      RETURNING *
    `;
    res.status(201).json(inserted);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await sql`DELETE FROM news WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Article record cleared from Neon cluster nodes.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- [MEDIA ALBUM GALLERY LAYER] ---
app.get('/api/gallery', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM gallery ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', async (req, res) => {
  try {
    const { caption, category, url } = req.body;
    const finalAssetUrl = await handleImageStorage(url);

    const [inserted] = await sql`
      INSERT INTO gallery (caption, category, url)
      VALUES (${caption}, ${category}, ${finalAssetUrl})
      RETURNING *
    `;
    res.status(201).json(inserted);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/gallery/:id', async (req, res) => {
  try {
    await sql`DELETE FROM gallery WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Media reference purged from relational arrays.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- [PARENT DESK COMMUNICATIONS LAYER] ---
app.get('/api/queries', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM parent_queries ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/queries', async (req, res) => {
  try {
    const { sender, subject, message } = req.body;
    const [inserted] = await sql`
      INSERT INTO parent_queries (sender, subject, message)
      VALUES (${sender}, ${subject}, ${message})
      RETURNING *
    `;
    res.status(201).json(inserted);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/queries/:id/resolve', async (req, res) => {
  try {
    const [updated] = await sql`
      UPDATE parent_queries 
      SET status = 'Reviewed' 
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- [AUTHENTICATION & IDENTITY MATRIX LAYER] ---

// 1. Gateway Portal Login Verification Routing Node (UPDATED FOR HASH MATCHING)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { id_number, password, role } = req.body;

    console.log("LOGIN REQUEST:", { id_number, role }); // Safe logging without plain password exposure

    // First fetch user by unique ID number and system access role context
    const [user] = await sql`
      SELECT id, id_number, role, full_name, password as hashed_password
      FROM users
      WHERE id_number = ${id_number}
      AND role = ${role}
    `;

    // Reject immediately if identity doesn't map to a real record
    if (!user) {
      return res.status(401).json({
        error: 'Invalid identification number or access token match.'
      });
    }

    // Graph securely compare runtime input against salt string array blocks inside server blocks
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid identification number or access token match.'
      });
    }

    // Strip hashed footprint signature before transmitting data payload down the wire
    delete user.hashed_password;

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Provision New User Profile Account Array (UPDATED FOR SECURE WRITE HASHING)
app.post('/api/users', async (req, res) => {
  try {
    const { id_number, password, role, full_name } = req.body;

    // Encrypt raw user input data into unique non-reversible character matrices using a cost factor of 10
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [inserted] = await sql`
      INSERT INTO users (id_number, password, role, full_name)
      VALUES (${id_number}, ${hashedPassword}, ${role}, ${full_name})
      RETURNING id, id_number, role, full_name, created_at
    `;

    console.log("USER CREATED SECURELY:", inserted.id);
    res.status(201).json(inserted);

  } catch (err) {
    console.error("USER INSERT ERROR:", err);

    if (err.message && (err.message.toLowerCase().includes('unique constraint') || err.message.toLowerCase().includes('duplicate key'))) {
      return res.status(400).json({
        error: 'This ID Number is already registered in the system.'
      });
    }

    res.status(500).json({ error: err.message });
  }
});

// 3. Fetch All Registered Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await sql`SELECT id, id_number, role, full_name, created_at FROM users ORDER BY created_at DESC`;
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. Revoke/Delete User Access Profile
app.delete('/api/users/:id', async (req, res) => {
  try {
    await sql`DELETE FROM users WHERE id = ${req.params.id}`;
    res.json({ success: true, message: 'Identity credentials purged from core system.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing live inside serverless node port ${PORT}`));
