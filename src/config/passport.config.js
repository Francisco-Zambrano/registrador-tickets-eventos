import passport from "passport";
import github from "passport-github2"
import local from "passport-local"
import { UserManagerMongo } from "../dao/userManagerMONGO.js";
import {CartManagerMongo} from '../dao/cartManagerMONGO.js';
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
            async(req, username, password, done) => {

                try {
                    let {name} = req.body
                    if(!name) {
                        return done(null, false)
                    }

                    let exist = await userManager.getBy({email:username})
                    if(exist) {
                        return done(null, false)
                    }

                    let newCart = await cartManager.createCart()

                    password = generateHash(password)

                    let user = await userManager.create({name, email:username, password, cart: newCart._id})
                    
                    return done(null, user)

                } catch (error) {
                    return done(error)
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
            async(username, password, done) => {

                try {
                    let user = await userManager.getBy({email:username})
                    if(!user){
                        return done(null, false)
                    }

                    if(!validatePassword(password, user.password)){
                        return done(null, false)
                    }

                    // user = {...user}
                    // delete user.password
                    // return done(null, user)

                } catch (error) {
                    return done(error)
                }

            }
        )

    );


    passport.use(
        "github",
        new github.Strategy(
            {
                // ingresar clientID
                clientID:"",
                // ingresar clientSecret
                clientSecret:"",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async(tokenAcceso, tokenRefresh, profile, done) => {

                try {
                    let email = profile._json.email
                    let name = profile._json.name
                    if(!name || !email){
                        return done(null, false)
                    }
                    let user = await userManager.getBy({email})
                    if(!user){
                        
                        user = await userManager.create({
                            name, email, profile
                        })
                    }

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }

            }
        )
    );


    passport.serializeUser((user, done) => {
        return done(null, user._id)
    });

    passport.deserializeUser(async(id, done) => {
        let user = await userManager.getBy({_id:id})
        return done(null, user)
    });

};