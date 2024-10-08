const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // for environment variables

const app = express();

// Serve static files from the public folder
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/callback', 
  passport.authenticate('google', { failureRedirect: '/', failureMessage: true }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile',  (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');  // Handle error if needed
    }

    // Redirect to Google logout URL
    res.redirect('https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/');
  });
});

// Catch-all route for invalid URLs
app.use((req, res) => {
  res.status(404).redirect('/');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
