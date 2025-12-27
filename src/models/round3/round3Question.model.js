import mongoose from "mongoose";

const round3QuestionSchema = new mongoose.Schema(
    {
        bombNumber: {
            type: Number,
            required: true,
            enum: [1, 2, 3],
        },

        questionNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        questionText: {
            type: String,
            required: true,
            trim: true,
        },

        correctAnswer: {
            type: String,
            required: true,
            select: false, 
            trim: true,
        },

        points: {
            type: Number,
            default: 5,
        },
    },
    {timestamps: true}
);

round3QuestionSchema.index(
    { bombNumber: 1, questionNumber: 1},
    { unique: true}
);

export default mongoose.model("Round3Question", round3QuestionSchema);