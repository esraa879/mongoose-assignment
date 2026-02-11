import { Router } from "express";
import * as noteService from "./notes.service.js";
import { auth } from "../../middleware/auth.middleware.js";

const noteRouter = Router();

noteRouter.post("/", auth, noteService.create);
noteRouter.get("/", auth, noteService.getMine);
noteRouter.put("/:noteId", auth, noteService.update);
noteRouter.delete("/:noteId", auth, noteService.remove);

export default noteRouter;
