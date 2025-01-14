// server.js
const express = require('express');
const adminRoutes = require('./routes/adminRouters');
const pageRoutes = require('./routes/pageRouters')
const path = require('path');
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
const cors = require("cors")
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', './views');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use method-override to handle PUT and PATCH in forms
app.use(methodOverride('_method'));
const cookieParser = require('cookie-parser');

//Middleware

// Log every request to the console

app.use(cookieParser());
// app.use(session({
//     secret: 'secret',
//     cookie: { secure: false },
//     resave: false,
//     saveUninitialized: false
// }))

app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes); // Mount the admin routes
app.use('/', pageRoutes );

const PORT = process.env.PORT;


// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

// Set up session middleware (using default MemoryStore)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  })
}));
// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//
.then(() => {
  app.listen(PORT, () => {
    console.log("Database connected. Listening on port:", PORT);
  });
})
.catch((error) => {
  console.log("Database connection error:", error);
});

// to start project, type 'npm run dev' in terminal
