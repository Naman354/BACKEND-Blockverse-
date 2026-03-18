import mongoose from "mongoose";
const puzzleSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim:true,
        },
        answerType: {
            type: String,
            enum: ["string", "number", "regex"],
            required: true,
        },
        answer: {
            type:String,
            required: true,
        },
        fragmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fragment",
            required: true,
        },
        },
        { timestamps: true}    
);
export default mongoose.model("Puzzle", puzzleSchema);