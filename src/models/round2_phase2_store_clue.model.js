import mongoose from "mongoose";

const storeClueSchema = new mongoose.Schema(
  {
    clueId: {
      type: String,
      required: true,
      unique: true,
    },

    round: {
      type: Number,
      default: 2,
    },

    phase: {
      type: Number,
      default: 2,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    tokenCost: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const StoreClue = mongoose.model("Round_2_phase2_StoreClue", storeClueSchema);
export default StoreClue;
