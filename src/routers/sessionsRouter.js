import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";


const router = Router();
const SECRET_KEY = 'adminCod3r123';

router.post('/register', passport.authenticate("register", {
    failureRedirect: "/api/sessions/error"
}), (req, res) => {
    res.status(201).json({ payload: `successful registration`, user: req.user });
});

// --SESSIONS LOGIN ROUTE--
// router.post("/login", passport.authenticate("login", {
//     failureRedirect: "/api/sessions/error"
// }), (req, res) => {
//     req.session.user = req.user;
//     res.status(200).redirect('/products');
// });


// --JWT LOGIN ROUTE--
router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/error",
    session: false
}), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    // res.status(200).redirect('/products');
    res.status(200).json({ payload: "successful login" });
});

// --SESSIONS LOGOUT ROUTE--
// router.get('/logout', (req, res) => {

//     req.logout((err) => {
//         if (err) {
//             console.log(err);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//         req.session.destroy((err) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
//             res.status(200).json({ payload: "successful logout" });
//         });
//     });
    
// });


// --JWT LOGOUT ROUTE--
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ payload: "successful logout" });
});

router.get('/error', (req, res) => {
    res.status(500).json({ error: 'Internal server error' });
});


// --SESSIONS GITHUB ROUTE--
// router.get('/github', passport.authenticate("github", {}));

// router.get('/callbackGithub', passport.authenticate("github", {
//     failureRedirect: "/login"
// }), (req, res) => {
//     req.session.user = req.user;
//     res.redirect('/products');
// });


// --JWT GITHUB ROUTE--
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
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});


export { router };