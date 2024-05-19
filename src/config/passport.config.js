import passport from "passport";
import github from "passport-github2"
import { UserManagerMongo } from "../dao/userManagerMONGO.js";


const userManager = new UserManagerMongo();

export const initPassport = () => {

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