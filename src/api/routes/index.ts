const { json } = require("express");
import { Router } from "express";

const router = Router();

//All API routes for Room Entity

//Testing the server
router.get('/', (req, res) => {
    res.render('index');
})


module.exports = router;