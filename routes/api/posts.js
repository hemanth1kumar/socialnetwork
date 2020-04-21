const express = require("express");
const router = express.Router();

//    @Route  =>  GET /api/posts  || @Access => Public
router.get("/", (req, res) => {
    res.send("Auth JS");
});

module.exports = router;
