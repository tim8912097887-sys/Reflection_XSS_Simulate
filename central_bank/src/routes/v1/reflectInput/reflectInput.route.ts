// Third party
import express from "express";
import ReflectInputController from "./reflectInput.controller.js";

// Initialize Instance
const reflectInputController = new ReflectInputController();

export const reflectInputRouter = express.Router();

reflectInputRouter.get("/", reflectInputController.reflectInput);
