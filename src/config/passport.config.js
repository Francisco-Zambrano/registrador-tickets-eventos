import passport from "passport";
// import github from "passport-github2";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserManagerMongo } from "../dao/userManagerMONGO.js";
import { CartManagerMongo } from '../dao/cartManagerMONGO.js';
import { generateHash, validatePassword } from "../utils.js";

const userManager = new UserManagerMongo();
const cartManager = new CartManagerMongo();

const SECRET_KEY = 'adminCod3r123';

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
                    const { first_name, last_name, age } = req.body;
                    if (!first_name || !last_name || !age) {
                        return done(null, false, { message: 'All fields are required' });
                    }

                    const exist = await userManager.getBy({ email: username });
                    if (exist) {
                        return done(null, false, { message: 'Email already exists' });
                    }

                    const newCart = await cartManager.createCart();
                    const hashedPassword = generateHash(password);
                    const user = await userManager.create({ 
                        first_name, 
                        last_name, 
                        age, 
                        email: username, 
                        password: hashedPassword, 
                        cart: newCart._id 
                    });

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

// --JWT STRATEGY--  

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                try {
                    const user = await userManager.getBy({ _id: jwt_payload.id });
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );

    passport.use(
        'current',
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                try {
                    const user = await userManager.getBy({ _id: jwt_payload.id });
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );


// --GITHUB STRATEGY--    
    // passport.use(
    //     "github",
    //     new github.Strategy(
    //         {
    //             clientID: "Iv23lirjulxHBc8sXGkM",
    //             clientSecret: "3f57dcf4b9f4330544cd47092e4ffa97c8bab17f",
    //             callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
    //         },
    //         async (tokenAcceso, tokenRefresh, profile, done) => {

    //             try {
    //                 const email = profile._json.email;
    //                 const name = profile._json.name;
    //                 if (!name || !email) {
    //                     return done(null, false, { message: 'GitHub profile missing email or name' });
    //                 }
    //                 let user = await userManager.getBy({ email });
    //                 if (!user) {
    //                     const newCart = await cartManager.createCart();
    //                     user = await userManager.create({
    //                         name, email, profile,cart: newCart._id
    //                     });
    //                 }

    //                 return done(null, user);
    //             } catch (error) {
    //                 return done(error);
    //             }
    //         }
    //     )
    // );

    // passport.serializeUser((user, done) => {
    //     done(null, user._id);
    // });

    // passport.deserializeUser(async(id, done)=>{
    //     let user=await userManager.getBy({_id:id})
    //     return done(null, user)
    // })
    
};