const express = require("express");
const router = express.Router();

// Index - users
router.get("/",(req,res) =>{
    res.send("GET for posts");
});

// Show - users
router.get("/:id", (req,res) =>{
    res.send("GET for post id");
});

// Post - users
router.post("/",(req,res) => {
    res.send("Post for posts");
});

// Delete - users
router.delete("/:id", (req,res) => {
    res.send("Delete for posts");
});

module.exports = router;