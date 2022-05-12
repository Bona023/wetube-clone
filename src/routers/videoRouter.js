import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); //^ id자리에 숫자만 올 수 있도록!!
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
