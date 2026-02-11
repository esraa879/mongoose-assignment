import mongoose from "mongoose";


const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
         trim: true,
      validate: {
        validator: function (v) {
          const t = (v || "").trim();
          return !(t.length > 0 && t === t.toUpperCase());
        },
        message: "title must not be entirely uppercase",
      },
    },

    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {
    timestamps: true,
     strictQuery:true
});

const noteModel = mongoose.models.note || mongoose.model("note", noteSchema);
export default noteModel