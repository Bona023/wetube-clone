export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.loggedInUser = req.session.user;
    res.locals.siteName = "Wetube";
    next();
};