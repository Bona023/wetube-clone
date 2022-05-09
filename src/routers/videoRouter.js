import express from "express";
import { upload, watch, getEdit, postEdit, deleteVideo } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); //^ id자리에 숫자만 올 수 있도록!!
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
