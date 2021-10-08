const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');

const { findUser, signUpOAuth } = require('../models/user-sql');
const { generateTokens } = require('../util/jwt-tokens');

dotenv.config();
let _id;

// Passport strategy for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => {
      const { email, firstName, lastName, provider } = profile._json;

      // check if user exists and write to DB if false
      const checkUserHandler = async () => {
        try {
          const [newUser, created] = await signUpOAuth(
            true,
            provider,
            providerId,
            accessToken,
            refreshToken,
            firstName,
            lastName,
            email
          );
          if (!created) return;
         _id = newUser._id;

          // call done() only ONCE, else callback will trigger multiple times
          done(null, profile);
        } catch (err) {
          done(err);
        }
      };
      checkUserHandler();
    },
  ),
);

// OAuth middlewares
exports.getGoogleOAuth = passport.authenticate('google', {
  scope:
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  prompt: 'select_account',
});

// Redirect to frontend, CHANGE ACCORDINGLY
exports.getGoogleOAuthCallback = function (req, res, next) {
  return passport.authenticate('google', (err, profile) => {
    if (err) {
      return res.redirect(`http://127.0.0.1:3000/404?msg=${err}`);
    }
    if (!profile) {
      return res.redirect(
        404,
        'http://127.0.0.1:3000/404?msg=no-profile-available',
      );
    }
    return generateTokens(_id, 'LOGIN')
      .then((tokens) => {
        res.cookie('accessToken', tokens.accessToken, { httpOnly: true });
        res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
        res.redirect('http://127.0.0.1:3000/home?state=oauth-redirect-success');
      })
      .catch((tokenErr) => {
        res.redirect(`http://127.0.0.1:3000/404?msg=${tokenErr}`);
      });
  })(req, res, next);
};
