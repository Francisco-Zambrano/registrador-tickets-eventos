import passport from "passport";
import local from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { DaoFactory } from "../dao/DaoFactory.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { CartRepository } from '../repositories/CartRepository.js';
import { generateHash, validatePassword } from "../utils.js";
import { config } from "./config.js";

const daoType = process.env.DAO_TYPE || 'mongo';
const { userDao, cartDao } = DaoFactory.getDao(daoType);

const userRepository = new UserRepository(userDao);
const cartRepository = new CartRepository(cartDao);

const SECRET_KEY = config.SECRET;

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
                    console.log("Registering user:", username);
                    const { first_name, last_name, age } = req.body;
                    if (!first_name || !last_name || !age) {
                        console.log("Missing fields");
                        return done(null, false, { message: 'All fields are required' });
                    }

                    const exist = await userRepository.getBy({ email: username });
                    if (exist) {
                        console.log("Email already exists:", username);
                        return done(null, false, { message: 'Email already exists' });
                    }

                    const newCart = await cartRepository.create({ products: [] });
                    const hashedPassword = generateHash(password);
                    const user = await userRepository.create({ 
                        first_name, 
                        last_name, 
                        age, 
                        email: username, 
                        password: hashedPassword, 
                        cart: newCart.id 
                    });

                    console.log("User registered successfully:", user);
                    return done(null, user);
                } catch (error) {
                    console.error("Error during registration:", error);
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
                session: false
            },
            async (username, password, done) => {
                try {
                    const user = await userRepository.getBy({ email: username });
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
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
                secretOrKey: SECRET_KEY
            },
            async (jwt_payload, done) => {
                try {
                    const user = await userRepository.getBy({ _id: jwt_payload.id });
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
                    const user = await userRepository.getBy({ _id: jwt_payload.id });
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
    //             clientID: config.CLIENT_ID,
    //             clientSecret: config.CLIENT_SECRET,
    //             callbackURL: config.CALLBACK_URL
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


