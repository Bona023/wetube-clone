let videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 4,
        createdAt: "10 minutes ago",
        views: 59,
        id: 1,
    },
    {
        title: "Second Video",
        rating: 4,
        comments: 2,
        createdAt: "7 minutes ago",
        views: 50,
        id: 2,
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 1,
        createdAt: "3 minutes ago",
        views: 1,
        id: 3,
    },
];
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
