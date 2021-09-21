const { json } = require("express");
import { Router } from "express";

const router = Router();

//All API routes for Room Entity

//Testing the server
router.get('/', (req, res) => {
    res.status(200).json({
        message: "Server is up and running!"
    });
})


module.exports = router;