import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

import Round1Question from "../src/models/Round_1_questions.model.js";
import Round2Question from "../src/models/round2_phase_1.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("DB", mongoose.connection.name);

const round1Data = JSON.parse(
  fs.readFileSync(new URL("./round1.json", import.meta.url))
);

const round2Data = JSON.parse(
  fs.readFileSync(new URL("./round2.json", import.meta.url))
);

await Round1Question.deleteMany({});
await Round1Question.insertMany(round1Data);

await Round2Question.deleteMany({});
await Round2Question.insertMany(round2Data);

console.log("Questions seeded");
process.exit();
