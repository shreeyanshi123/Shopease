const passport = require('passport');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Remove Google Strategy
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: 'https://shopease-q3li.onrender.com/auth/google/callback',
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ email: profile.emails[0].value });
//     if (!user) {
//       user = await User.create({
//         userName: profile.displayName,
//         email: profile.emails[0].value,
//         password: '',
//         role: 'user',
//         googleId: profile.id,
//       });
//     }
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// }));

module.exports = passport;
