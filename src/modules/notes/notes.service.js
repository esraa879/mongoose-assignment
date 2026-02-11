import noteModel from "../../DB/models/note.model.js";

export const create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;

    const note = await noteModel.create({ title, content, userId });

    return res.status(201).json({
      message: "note created successfully",
      note,
    });
  } catch (error) {
    return res.status(400).json({
      message: "validation error",
      error: error.message,
    });
  }
};

export const getMine = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await noteModel.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(400).json({
      message: "validation error",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const userId = req.userId;
    const { noteId } = req.params;
    const { title, content } = req.body;

    const note = await noteModel.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) return res.status(404).json({ message: "note not found" });

    return res.status(200).json({ message: "note updated", note });
  } catch (error) {
    return res.status(400).json({
      message: "validation error",
      error: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const { noteId } = req.params;

    const deleted = await noteModel.findOneAndDelete({ _id: noteId, userId });

    if (!deleted) return res.status(404).json({ message: "note not found" });

    return res.status(200).json({ message: "note deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};




