// --JWT MIDDLEWARE--
import passport from 'passport';

export const auth = passport.authenticate('jwt', { session: false });


// --SESSIONS MIDDLEWARE--
// export const auth = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/login');
//   };