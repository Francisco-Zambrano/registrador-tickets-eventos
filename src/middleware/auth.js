// export const auth=(req, res, next)=>{
//     if(!req.session.user){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`user does not exist`})
//     }

//     next()
// }


export const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  };
  