import { Router } from "express"
import { UserManagerMongo} from "../dao/userManagerMONGO.js"
import { generateHash, validatePassword } from "../utils.js"


export const router = Router();

const userManager = new UserManagerMongo();

router.post('/register', async (req, res) => {

    let {name, email, password} = req.body
    if(!name || !email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `Name, email and password are required`})
    }

    let exist = await userManager.getBy({email})
       if(exist){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `${email} already exists`})
    }

    password = generateHash(password)

    try {
        let newUser = await userManager.create({name, email, password})
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({
            message: "User successfully registered", newUser
        })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json({ error: 'Internal server error' });
    }

});


router.post('/login', async(req, res) => {

    let {email, password} = req.body
    if(!email || !password) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `email and password are required`})
    }

    // let user = await userManager.getBy({email, password: generateHash(password)})
    let user = await userManager.getBy({email})
       if(!user){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `invalid data`})
    }

    if(!validatePassword(password, user.password)){
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: `invalid data`})
    }

    user = {...user}
    delete user.password
    req.session.user = user


    res.setHeader('Content-Type', 'application/json');
    // return res.status(200).json({payload: `successful login`, user})
    return res.status(200).redirect('/products');

});

router.get("/logout", (req, res)=>{

    req.session.destroy(e=>{
        if(e){
            console.log(error);
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({ error: 'Internal server error' });   
        }
    })

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:"successful logout"});
    
});