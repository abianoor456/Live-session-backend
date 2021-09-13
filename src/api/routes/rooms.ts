const { json } = require("express");
const roomController = require(`../controllers/rooms`);
import { Router } from "express";

const router = Router();

//All API routes for Room Entity

//Create a Room
router.post(`/:name`, roomController.createSession);

//Join a Room
router.get(`/:password`, roomController.getSession);

module.exports = router;