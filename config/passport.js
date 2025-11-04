import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import FacebookStrategy from "passport-facebook";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();


passport.serializeUser((user, done) => {
  done(null, user.id); // mongo id
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


// Google
passport.use(new GoogleStrategy.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, provider: "google" });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        provider: "google",
        providerId: profile.id,
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// GitHub
passport.use(new GitHubStrategy.Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ providerId: profile.id, provider: "github" });
    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email: profile.emails && profile.emails[0] && profile.emails[0].value,
        provider: "github",
        providerId: profile.id,
        avatar: profile.photos && profile.photos[0] && profile.photos[0].value
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Facebook (optional)
if (process.env.FACEBOOK_CLIENT_ID) {
  passport.use(new FacebookStrategy.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
   profileFields: ['id', 'displayName', 'photos']   // <- remove email

  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ providerId: profile.id, provider: "facebook" });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails && profile.emails[0] && profile.emails[0].value,
          provider: "facebook",
          providerId: profile.id,
          avatar: profile.photos && profile.photos[0] && profile.photos[0].value
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}
