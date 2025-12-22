import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Round1Question from "../src/models/Round_1_questions.model.js";
import Round2Question from "../src/models/round2_phase_1.model.js";
import Round2Clue from "../src/models/round2_phase2_store_clue.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected DB:", mongoose.connection.name);

const round1Data = JSON.parse(
  fs.readFileSync(new URL("./round1.json", import.meta.url))
);

const round2Phase1Data = JSON.parse(
  fs.readFileSync(new URL("./round2_phase1.json", import.meta.url))
);

const round2ClueYear1Data = JSON.parse(
  fs.readFileSync(new URL("./round2_clues_year1.json", import.meta.url))
);

const round2ClueYear2Data = JSON.parse(
  fs.readFileSync(new URL("./round2_clues_year2.json", import.meta.url))
);

await Round1Question.deleteMany({});
await Round2Question.deleteMany({});
await Round2Clue.deleteMany({});

await Round1Question.insertMany(round1Data);
await Round2Question.insertMany(round2Phase1Data);
await Round2Clue.insertMany([...round2ClueYear1Data, ...round2ClueYear2Data]);

console.log("Round 1 questions seeded");
console.log("Round 2 Phase 1 questions seeded");
console.log("Round 2 Phase 2 clues seeded");

process.exit(0);
