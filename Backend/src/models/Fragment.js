import mongoose from "mongoose";
const fragmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true}
);
export default mongoose.model("Fragment", fragmentSchema);