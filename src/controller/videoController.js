export const trending = (req, res) => {
    return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
    const { id } = req.params; //! (같은 코드) const id = req.params.id
    const video = videos[id - 1]; //^ 리스트는 0부터 세지만 id는 1부터 시작하니까
    res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    res.render("Edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {
        pageTitle: "Upload Video",
    });
};
export const postUpload = (req, res) => {
    const { title } = req.body;
    const newVideo = {
        title,
        rating: 0,
        comments: 0,
        createdAt: "just now",
        id: videos.length + 1,
    };
    videos.push(newVideo);
    return res.redirect("/");
};
