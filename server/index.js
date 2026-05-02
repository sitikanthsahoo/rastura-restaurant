const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rastura_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Initial Admin (Temporary utility - remove in production)
app.post('/api/admin/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reservation Schema
const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: String, required: true },
  requests: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Menu = mongoose.model('Menu', menuSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// --- PUBLIC ROUTES ---

// POST: Create Reservation (Public)
app.post('/api/reservations', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    const savedReservation = await newReservation.save();
    res.status(201).json({
      success: true,
      message: 'Reservation submitted successfully',
      data: savedReservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting reservation',
      error: error.message
    });
  }
});

// GET: All Menu Items (Public)
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ⚠️ TEMPORARY — Seed all menu items into MongoDB (remove after use)
app.get('/api/seed-menu', async (req, res) => {
  try {
    const indianMenu = [
      { category: "Starters", name: "Paneer Tikka", desc: "Cottage cheese marinated in spiced yogurt, grilled in tandoor with bell peppers and onions. Served with mint chutney.", price: 349, isVeg: true, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800" },
      { category: "Starters", name: "Seekh Kebab", desc: "Minced lamb seasoned with ginger, garlic, green chillies & fresh herbs, skewered and cooked in a tandoor.", price: 449, isVeg: false, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800" },
      { category: "Starters", name: "Dahi Puri", desc: "Crispy puris filled with spiced mashed potato, topped with sweet yogurt, tamarind chutney & sev.", price: 199, isVeg: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800" },
      { category: "Starters", name: "Chicken Malai Tikka", desc: "Tender chicken pieces marinated in cream, cashew paste, cardamom & saffron. Slow cooked in tandoor.", price: 499, isVeg: false, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800" },
      { category: "Mains", name: "Butter Chicken", desc: "Tender chicken in a velvety tomato-cream sauce with aromatic spices, finished with kasuri methi and butter.", price: 549, isVeg: false, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800" },
      { category: "Mains", name: "Dal Makhani", desc: "Black lentils slow-cooked overnight with butter, cream and a rich blend of aromatic spices. A Rastura classic.", price: 379, isVeg: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800" },
      { category: "Mains", name: "Hyderabadi Dum Biryani", desc: "Fragrant basmati rice layered with spiced chicken, caramelized onions & saffron, slow-cooked in a sealed pot.", price: 649, isVeg: false, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800" },
      { category: "Mains", name: "Palak Paneer", desc: "Cottage cheese in a silky smooth spinach gravy, tempered with cumin, garlic and a touch of cream.", price: 399, isVeg: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800" },
      { category: "Mains", name: "Rogan Josh", desc: "Slow-braised Kashmiri lamb shanks in a bold sauce of whole spices, Kashmiri red chillies & fennel.", price: 749, isVeg: false, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?auto=format&fit=crop&q=80&w=800" },
      { category: "Desserts", name: "Gulab Jamun", desc: "Soft milk-solid dumplings fried golden, soaked in rose-cardamom sugar syrup. Served warm with rabri.", price: 199, isVeg: true, image: "https://images.unsplash.com/photo-1666791898378-a3421736b5e6?auto=format&fit=crop&q=80&w=800" },
      { category: "Desserts", name: "Rasmalai", desc: "Delicate cottage cheese dumplings soaked in chilled saffron milk, garnished with pistachios & rose petals.", price: 249, isVeg: true, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800" },
      { category: "Desserts", name: "Kulfi Falooda", desc: "Traditional Indian ice cream with rose syrup, basil seeds, vermicelli noodles and fresh mango puree.", price: 279, isVeg: true, image: "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?auto=format&fit=crop&q=80&w=800" },
      { category: "Drinks", name: "Mango Lassi", desc: "Thick and creamy Alphonso mango blended with chilled yogurt, a pinch of cardamom & saffron strands.", price: 199, isVeg: true, image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&q=80&w=800" },
      { category: "Drinks", name: "Masala Chai", desc: "Our signature spiced tea with ginger, cardamom, cinnamon & cloves, brewed with full-fat milk.", price: 99, isVeg: true, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=800" },
      { category: "Drinks", name: "Rose Sharbat", desc: "Chilled rose-water drink with basil seeds, lemon, a hint of black salt and fresh mint.", price: 149, isVeg: true, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800" },
    ];
    const count = await Menu.countDocuments();
    if (count > 0) return res.json({ message: `Menu already has ${count} items. No changes made.` });
    await Menu.insertMany(indianMenu);
    res.json({ message: `✅ Successfully seeded ${indianMenu.length} Indian menu items into MongoDB!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: All Events (Public)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- PROTECTED ADMIN ROUTES ---

// GET: All Reservations (Protected)
app.get('/api/admin/reservations', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH: Update Reservation Status (Protected)
app.patch('/api/admin/reservations/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove Reservation (Protected)
app.delete('/api/admin/reservations/:id', auth, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add Menu Item (Protected)
app.post('/api/admin/menu', auth, async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH: Update Menu Item (Protected)
app.patch('/api/admin/menu/:id', auth, async (req, res) => {
  try {
    const updatedItem = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove Menu Item (Protected)
app.delete('/api/admin/menu/:id', auth, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add Event (Protected)
app.post('/api/admin/events', auth, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove Event (Protected)
app.delete('/api/admin/events/:id', auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Connect to MongoDB & Start Server
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rastura';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (Database disconnected)`);
    });
  });
