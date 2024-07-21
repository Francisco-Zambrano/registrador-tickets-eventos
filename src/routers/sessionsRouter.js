import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { DaoFactory } from "../dao/DaoFactory.js";
import { UserDTO } from "../dto/UserDTO.js";
import { UserRepository } from "../repositories/UserRepository.js";
import { mailTransporter } from "../middleware/mailTransporter.js";
import { UserController } from "../controllers/userController.js";


const daoType = process.env.DAO_TYPE || 'mongo';
const { userDao } = DaoFactory.getDao(daoType);

const userRepository = new UserRepository(userDao);

const router = Router();
const SECRET_KEY = config.SECRET;

router.post('/register', passport.authenticate("register", {

   failureRedirect: "/api/sessions/error",
   session: false
}), (req, res) => {
   res.status(201).json({ payload: `successful registration`, user: req.user });

});

router.post("/login", passport.authenticate("login", {

   failureRedirect: "/api/sessions/error",
   session: false
}), (req, res) => {
   const user = req.user;
   const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
   res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
   res.status(200).json({ payload: "successful login" });

});

router.get('/logout', (req, res) => {

   res.clearCookie('token');
   res.status(200).json({ payload: "successful logout" });

});

router.get('/error', (req, res) => {
   res.status(500).json({ error: 'Internal server error' });
});

router.get('/github', passport.authenticate("github", { session: false }));

router.get('/callbackGithub', passport.authenticate("github", {

   failureRedirect: "/login",
   session: false
}), (req, res) => {
   const user = req.user;
   const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
   res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
   res.redirect('/products');

});

router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {

   if (req.user) {
     const userDTO = new UserDTO(req.user);
     res.status(200).json({ user: userDTO });
   } else {
     res.status(401).json({ error: 'Unauthorized' });
   }

});

router.get('/mail', mailTransporter);

router.get('/reset-password', (req, res) => {
   const { token } = req.query;
   if (!token) {
       return res.status(400).send('Token is required');
   }
   res.render('password', { token });
});

router.post('/reset-password', UserController.resetPassword);

router.get('/reset-password-expired', (req, res) => {
   res.render('resetPasswordExpired');
});

export { router };