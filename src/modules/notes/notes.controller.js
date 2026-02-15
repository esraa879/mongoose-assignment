import { Router } from "express";
import * as noteService from "./notes.service.js";
import { auth } from "../../middleware/auth.middleware.js";

const noteRouter = Router();

noteRouter.post("/", auth, noteService.create);
noteRouter.get("/", auth, noteService.getMine);

noteRouter.put("/replace/:noteId", auth, noteService.replace);
noteRouter.patch("/all", auth, noteService.updateAllTitles);

noteRouter.get("/paginate-sort", auth, noteService.paginateSort);
noteRouter.get("/note-by-content", auth, noteService.getByContent);
noteRouter.get("/note-with-user", auth, noteService.noteWithUser);
noteRouter.get("/aggregate", auth, noteService.aggregateNotes);

noteRouter.get("/:noteId", auth, noteService.getById);

noteRouter.put("/:noteId", auth, noteService.update);

noteRouter.delete("/", auth, noteService.deleteAll);
noteRouter.delete("/:noteId", auth, noteService.remove);

export default noteRouter;
