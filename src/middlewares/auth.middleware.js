import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Team from "../models/team.model.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // console.log("Token....", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log("decoded......", decoded);

    const team = await Team.findById(decoded.sub).select("_id teamId");

    if (!team) {
      return res.status(401).json({
        success: false,
        message: "Team not found",
      });
    }

    req.user = {
      _id: team._id,
      teamId: team.teamId,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};
