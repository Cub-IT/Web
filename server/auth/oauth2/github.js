const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:9090/api/auth/login/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    // asynchronous verification, for effect...
    // process.nextTick(function () {
      
    //   // To keep the example simple, the user's GitHub profile is returned to
    //   // represent the logged-in user.  In a typical application, you would want
    //   // to associate the GitHub account with a user record in your database,
    //   // and return that user instead.
    //   return done(null, profile);
    // });
    return done(null, profile);
  }
));
