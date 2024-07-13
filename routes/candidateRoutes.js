const express = require("express");
const router = express.Router();
const { jwtMiddleware } = require("../jwt");
const User = require("../models/user");
const Candidate = require("../models/candidate");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (error) {
    console.error("Error in checkAdminRole:", error);
    return false;
  }
};

// POST route to add a candidate
router.post("/signup", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();

    console.log("Data saved");
    res.status(200).json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:candidateID", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:candidateID", jwtMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateID = req.params.candidateID;
    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LET'S START VOTING

router.post("/vote/:candidateID", jwtMiddleware, async (req, res) => {
  const candidateID = req.params.candidateID;
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to vote" });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;

    await candidate.save();
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Vote count

router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
