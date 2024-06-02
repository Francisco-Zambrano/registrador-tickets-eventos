import passport from "passport";
import github from "passport-github2";
import local from "passport-local";
import { UserManagerMongo } from "../dao/userManagerMONGO.js";
import { CartManagerMongo } from '../dao/cartManagerMONGO.js';
import { generateHash, validatePassword } from "../utils.js";

const userManager = new UserManagerMongo();
const cartManager = new CartManagerMongo();

export const initPassport = () => {

    passport.use(
        "register",
        new local.Strategy(
            {
                passReqToCallback: true,
                usernameField: "email"
            },
            async (req, username, password, done) => {

                try {
                    const { first_name } = req.body;
                    if (!first_name) {
                        return done(null, false, { message: 'First name is required' });
                    }

                    const { last_name } = req.body;
                    if (!last_name) {
                        return done(null, false, { message: 'Last name is required' });
                    }

                    const { age } = req.body;
                    if (!age) {
                        return done(null, false, { message: 'Age is required' });
                    }

                    const exist = await userManager.getBy({ email: username });
                    if (exist) {
                        return done(null, false, { message: 'Email already exists' });
                    }

                    const newCart = await cartManager.createCart();
                    const hashedPassword = generateHash(password);

                    const user = await userManager.create({ first_name, last_name, age, email: username, password: hashedPassword, cart: newCart._id });

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done) => {

                try {
                    const user = await userManager.getBy({ email: username });
                    if (!user) {
                        return done(null, false, { message: 'Incorrect email or password' });
                    }

                    if (!validatePassword(password, user.password)) {
                        return done(null, false, { message: 'Incorrect email or password' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID: "Iv23lirjulxHBc8sXGkM",
                clientSecret: "3f57dcf4b9f4330544cd47092e4ffa97c8bab17f",
                callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
            },
            async (tokenAcceso, tokenRefresh, profile, done) => {

                try {
                    const email = profile._json.email;
                    const name = profile._json.name;
                    if (!name || !email) {
                        return done(null, false, { message: 'GitHub profile missing email or name' });
                    }
                    let user = await userManager.getBy({ email });
                    if (!user) {
                        const newCart = await cartManager.createCart();
                        user = await userManager.create({
                            name, email, profile,cart: newCart._id
                        });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done)=>{
        let user=await userManager.getBy({_id:id})
        return done(null, user)
    })
    
};