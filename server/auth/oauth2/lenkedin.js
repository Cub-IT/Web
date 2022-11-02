const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const LINKEDIN_KEY = process.env.LINKEDIN_KEY;
const LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;

passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "http://localhost:9090/api/auth/login/linkedin/callback",
  }, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }));