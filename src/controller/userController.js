import User from "../models/User";
import fetch from "cross-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("users/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const { name, email, username, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.status(400).render("users/join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};

export const getLogin = (req, res) => {
    return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("users/login", {
            pageTitle,
            errorMessage: "존재하지 않는 username 입니다.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("users/login", {
            pageTitle,
            errorMessage: "Password가 일치하지 않습니다.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email", //^ 반드시 띄어쓰기로 구분할 것!!
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userData);
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            //todo : set notification
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        //^ github으로 로그인한 사람이 기존에 가입된 사람인지 확인 (email로 가입했는지 github으로 가입했는지 구분 X)
        if (!user) {
            //^ 지금 github으로 로그인한 사람이 기존 가입자가 아니면 계정 생성
            //^ 새로 생성한 계정 내용으로 user를 재정의 (그래서 let 사용)
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                email: emailObj.email,
                username: userData.login,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        //^ 지금 github으로 로그인한 사람이 기존 가입자라서
        //^ 아니면 새로 계정을 생성해서
        //^ 로그인 시켜주고 로그인 상태로 홈으로 redirect
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { name, username, email, location },
    } = req;
    if (req.session.user.username !== username) {
        const exists = await User.exists({ username });
        if (exists) {
            return res.status(400).render("users/edit-profile", { pageTitle: "Edit Profile", errorMessage: "이미 사용중인 username 입니다." });
        }
    }
    if (req.session.user.email !== email) {
        const exists = await User.exists({ email });
        if (exists) {
            return res.status(400).render("users/edit-profile", { pageTitle: "Edit Profile", errorMessage: "이미 사용중인 email 입니다." });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            name,
            username,
            email,
            location,
        },
        { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPassword1 },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "현재 Password와 일치하지 않습니다." });
    }
    if (newPassword !== newPassword1) {
        return res.status(400).render("users/change-password", { pageTitle: "Change Password", errorMessage: "새 Password가 Password Confirmation과 일치하지 않습니다." });
    }
    user.password = newPassword;
    await user.save();
    return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
