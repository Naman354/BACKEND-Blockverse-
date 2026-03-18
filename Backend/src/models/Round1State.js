import mongoose from "mongoose";
const round1StateSchema = new mongoose.Schema(
    {
        teamId: {
            type: MongooseError.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
            unique: true,
        },
        puzzleOrder: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Puzzle",
                required: true,
            },
        ],
        solvedPuzzles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Puzzle",
            },
        ],
        unlockedFragments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                 ref: "Fragment",
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        startedAt: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);
export default mongoose.model("Round1State", round1StateSchema);
