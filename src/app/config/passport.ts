import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import { EnvConfig } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        if (!email || !password || typeof password !== "string") {
          return done(null, false, {
            message: "Email and password are required",
          });
        }
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done(null, false, { message: "User is not registered yet" });
        }
        const isGoogleAuthenticate = isUserExist.auths.some(
          (provider) => provider.provider === "google"
        );
        if (isGoogleAuthenticate && !isUserExist.password) {
          return done(null, false, {
            message:
              "You are authenticate using google. Please login using google first and set a password.",
          });
        }

        const isMatchedPassword = await bcrypt.compare(
          password,
          isUserExist.password as string
        );

        if (!isMatchedPassword) {
          return done(null, false, { message: "Password doesn't match" });
        }
        return done(null, isUserExist);
      } catch (error) {
        console.log("Error from local strategy: ", error);
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: EnvConfig.GOOGLE_CLIENT_ID,
      clientSecret: EnvConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: EnvConfig.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            isVerified: true,
            role: Role.USER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user, { message: "User created successfully" });
      } catch (error) {
        console.log("Google Strategy error: ", error);
        return done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
