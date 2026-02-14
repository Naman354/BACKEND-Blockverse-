import mongoose from "mongoose";

const round3QuestionSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      enum: [1, 2],
      required: true,
    },

    bombNumber: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
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

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length === 4;
        },
        message: "Each question must have exactly 4 options.",
      },
    },

    correctAnswer: {
    type: String,
    required: true,
    select: false,
    trim: true,
    validate: {
        validator: function (value) {
        return this.options.includes(value);
        },
        message: "Correct answer must be one of the provided options.",
    },
    },


    clueUsed: {
      type: String,
      required: true,
      trim: true,
    },

    points: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

round3QuestionSchema.index(
  { year: 1, bombNumber: 1, questionNumber: 1 },
  { unique: true }
);

export default mongoose.model("Round3Question", round3QuestionSchema);
