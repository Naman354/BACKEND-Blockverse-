import mongoose from "mongoose";

const questionProgressSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Round3Question",
            required: true,
        },
        questionNumber: {
            type: Number,
            required: true,
        },

        questionText: {
            type: String,
            required: true,
        },

        points: {
            type: Number,
            required: true,
        },
        solved: {
            type: Boolean,
            default: false,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        },
    { _id:false }
);

const bombProgressSchema = new mongoose.Schema(
    {
        bombNumber: {
            type: Number,
            required: true,
        },

        mistakes: {
            type:Number,
            default: 0,
        },

        questions: {
            type: [questionProgressSchema],
            default: [],
        },
    },
    { _id: false }
);

const round3ProgressSchema = new mongoose.Schema(
    {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            unique: true,
            index: true,
        },

        status: {
             type: String,
             enum: [
                "NOT_STARTED",
                "IN_PROGRESS",
                "COMPLETED",
                "DISQUALIFIED",
                "TIME_UP",
             ],
             default: "NOT_STARTED",
        },

        startedAt: {
            type: Date,
            required: true,
        },

        endedAt: {
            type:Date,
        },

        bombs: {
            type: [bombProgressSchema],
            default: [],
        },

        scoreAdded: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true}
);

export default mongoose.model("Round3Progress", round3ProgressSchema);