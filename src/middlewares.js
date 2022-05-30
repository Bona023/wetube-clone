export const localMiddleware = (req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Wetube";
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/");
    }
};
