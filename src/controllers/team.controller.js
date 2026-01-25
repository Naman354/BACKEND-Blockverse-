import Team from "../models/team.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import nodemailer from "nodemailer";
import { calculateTeamScore } from "../utils/calculateScore.js";

dotenv.config();

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
  MAIL_PASS,
  MAIL_USER,
} = process.env;

function signAccessToken(team) {
  return jwt.sign({ sub: team._id }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES || "1h",
  });
}

function signRefreshToken(team) {
  return jwt.sign({ sub: team._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES || "7d",
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});

const akgecEmailRegex = /^[a-zA-Z0-9._]+@akgec\.ac\.in$/;

const registerTeam = asyncHandler(async (req, res) => {
  let { teamId, password, year, members } = req.body;

  if (!teamId || !password || !year || !members?.length) {
    throw new ApiError(
      400,
      "Team ID, password, year and team members are required",
    );
  }

  if (![1, 2].includes(year)) {
    throw new ApiError(400, "Year must be 1 or 2");
  }

  teamId = teamId.trim().toUpperCase();

  const emails = members.map((m) => m.email?.toLowerCase());
  if (new Set(emails).size !== emails.length) {
    throw new ApiError(400, "Duplicate emails in team members");
  }

  for (const member of members) {
    if (!member.name || !member.email || !member.rollNo || !member.branch) {
      throw new ApiError(400, "Invalid team member details");
    }
    if (!akgecEmailRegex.test(member.email)) {
      throw new ApiError(400, `Invalid college email: ${member.email}`);
    }
  }

  const existingTeam = await Team.findOne({ teamId });
  if (existingTeam) {
    throw new ApiError(409, "Team is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const team = await Team.create({
    teamId,
    password: passwordHash,
    year,
    members,
  });

  const teamResponse = team.toObject();
  delete teamResponse.password;

  return res
    .status(201)
    .json(new ApiResponse(201, teamResponse, "Team registered successfully"));
});

const loginTeam = asyncHandler(async (req, res) => {
  let { teamId, password } = req.body;

  if (!teamId || !password) {
    throw new ApiError(400, "Team ID and password are required");
  }

  teamId = teamId.trim().toUpperCase();

  const team = await Team.findOne({ teamId });
  if (!team) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, team.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken(team);
  const refreshToken = signRefreshToken(team);

  //Checking.........

  const dynamicScore = await calculateTeamScore(team_id);
  const teamResponse = team.toObject();
  delete teamResponse.password;
  teamResponse.totalPoints = dynamicScore;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { team: teamResponse, accessToken, refreshToken },
        "Team login successful",
      ),
    );
});

export { registerTeam, loginTeam };
