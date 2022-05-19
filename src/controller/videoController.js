import Video from "../models/video";

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
    const { id } = req.params; //! (같은 코드) const id = req.params.id
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not Found" });
    }
    return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not Found" });
    }
    res.render("Edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.render("404", { pageTitle: "Video not Found" });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {
        pageTitle: "Upload Video",
    });
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (error) {
        return res.redirect("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};
