import express from "express";
import { upload, see, edit, deleteVideo } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see); //^ id자리에 숫자만 올 수 있도록!!
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
