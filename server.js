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
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', './views');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');

//Middleware

// Log every request to the console

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    cookie: { secure: false },
    resave: false,
    saveUninitialized: false
}))

app.use(flash());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes); // Mount the admin routes
app.use('/', pageRoutes );

const PORT = process.env.PORT;


// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));


// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Database-connected at , Listening port = ",process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });