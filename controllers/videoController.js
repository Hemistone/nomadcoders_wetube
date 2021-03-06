import routes from "../routes";
import Video from "../models/video";
import Comment from "../models/comment";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 });
        res.render("home", { pageTitle: "Home", videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }

};

export const search = async (req, res) => {
    const {
        query: { term: searchingBy }
    } = req;
    let videos = [];
    try {
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" }
        });
    } catch (error) {
        console.log(error)
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
    res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        file: { location }
    } = req;

    // To Do: Upload and save video
    const newVideo = await Video.create({
        fileUrl: location,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    console.log(newVideo);
    res.redirect(routes.videoDetail(newVideo.id));
};


export const videoDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id)
            .populate("creator")
            .populate("comments");
        console.log(video);
        res.render("videoDetail", { pageTitle: Video.title, video });
    } catch (error) {
        res.redirect(routes.home);
    }
};
export const getEditVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        console.log(video);
        if (video.creator !== req.user.id) {
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
    res.render("editVideo", { pageTitle: "Edit Video" });
}

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const video = await Video.findById(id);
        if (video.creator !== req.user.id) {
            throw Error();
        } else {
            await Video.findOneAndRemove({ _id: id });
        }
    } catch (error) {

    }
    res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

// Add Comment

export const postAddComment = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user
    } = req;
    try {
        const video = await Video.findById(id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        video.comments.push(newComment.id);
        video.save();
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

export const postDelComment = async (req, res) => {
    const {
        params: { video, cmtid }
    } = req;
    try {
        const vid = await Video.findById(video);
        const deletingComment = await Comment.findById(cmtid);
        for (let comment of vid.comments) {
            let cmt = comment._id.toString();
            if (cmt == cmtid) {
                vid.comments.pull(deletingComment.id);
                vid.save();
                await Comment.findOneAndRemove({ _id: cmt });
                console.log("removed comment from database");
                break;
            } else {
                console.log("no comment found...");
            }
        }
        res.redirect(`/videos/${video}`);
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end();
    }
};