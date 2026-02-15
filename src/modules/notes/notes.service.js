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



export const replace = async (req, res) => {
  try {
    const userId = req.userId;    
    const { noteId } = req.params;
    const { title, content } = req.body;

   
    const note = await noteModel.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    
    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not the owner" });
    }

  
    const replaced = await noteModel.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "note replaced successfully", note: replaced });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};


export const updateAllTitles = async (req, res) => {
  try {
    const userId = req.userId;     
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const result = await noteModel.updateMany(
      { userId },
      { title }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ message: "All notes updated" });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
      error: error.message,
    });
  }
};



export const paginateSort = async (req, res) => {
  try {
    const userId = req.userId;

 
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const notes = await noteModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

  return res.status(200).json({ page, limit, count: notes.length, notes });

  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};


export const getById = async (req, res) => {
  try {
    const userId = req.userId;
    const { noteId } = req.params;

    const note = await noteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not the owner" });
    }

    return res.status(200).json({ note });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getByContent = async (req, res) => {
  try {
    const userId = req.userId;
    const { content } = req.query;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const note = await noteModel.findOne({ userId, content });

    if (!note) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ note });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};




export const deleteAll = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await noteModel.deleteMany({ userId });

    return res.status(200).json({
      message: "Deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};

export const noteWithUser = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await noteModel
      .find({ userId })
      .select("title userId createdAt")
      .populate({ path: "userId", select: "email" });

    if (!notes.length) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};

export const aggregateNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.query;

    const pipeline = [
      
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },


      ...(title
        ? [
            {
              $match: {
                title: { $regex: title, $options: "i" }, 
              },
            },
          ]
        : []),

   
      {
        $lookup: {
          from: "users",          
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          title: 1,
          userId: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email",
          },
        },
      },

      
      { $sort: { createdAt: -1 } },
    ];

    const notes = await noteModel.aggregate(pipeline);

    if (!notes.length) {
      return res.status(404).json({ message: "No note found" });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
};

