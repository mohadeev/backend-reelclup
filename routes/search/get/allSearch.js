import express from "express";
const allSearch = express.Router();

allSearch.get("/", async (req, res) => {
  res.json("sdl");
});

export default allSearch;
//dfg
