const express = require('express');
const passport = require('../../auth/passport');
const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/auth/login',
  session: true
}), (req, res) => {
  req.session.save(() => {
    // Redirect to frontend after login
    res.redirect('https://shopease-frontend-sdjy.onrender.com/shop/home');
  });
});

module.exports = router;
