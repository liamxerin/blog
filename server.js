const express = require('express');
const adminRoutes = require('./routes/adminRouters');
const pageRoutes = require('./routes/pageRouters');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables early

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Log every request to the console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// CORS configuration (if required)
app.use(cors());

// Session middleware (with MongoDB session store)
if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  throw new Error('Missing SESSION_SECRET or MONGO_URI in environment variables');
}
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

// Flash middleware
app.use(flash());

// Mount routes
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);

// Database connection and server startup
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connected. Listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// To start the project, run `npm run dev` in the terminal
