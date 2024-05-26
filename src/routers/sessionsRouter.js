import { Router } from "express";
import passport from "passport";

export const router = Router();

router.post('/register', passport.authenticate("register", {
    failureRedirect: "/api/sessions/error"
}), (req, res) => {
    res.status(201).json({ payload: `successful registration`, user: req.user });
});

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/error"
}), (req, res) => {
    req.session.user = req.user;
    res.status(200).redirect('/products');
});

router.get('/logout', (req, res) => {

    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(200).json({ payload: "successful logout" });
        });
    });
    
});

router.get('/error', (req, res) => {
    res.status(500).json({ error: 'Internal server error' });
});

router.get('/github', passport.authenticate("github", {}));

router.get('/callbackGithub', passport.authenticate("github", {
    failureRedirect: "/login"
}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});
