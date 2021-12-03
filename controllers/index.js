const express = require("express");
const router = express.Router();
const db = require("../models/exerciseModel");
const path= require("path");
router.get("/stats", (req,res)=>{
  res.sendFile(path.join(__dirname,"../public/stats.html"))
})
router.get("/exercise", (req,res)=>{
  res.sendFile(path.join(__dirname,"../public/exercise.html"))
})
router.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname,"../public/index.html"))
})

router.get("/api/workouts", (req, res) => {
  db.aggregate(
    [
      { $match: {} },
      {
        $addFields: {
          totalDuration: {
            $reduce: {
              input: "$exercises",
              initialValue: 0,
              in: {
                $add: ["$$value", "$$this.duration"],
              },
            },
          },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    }
  );
});

// creates a new workout

router.post("/api/workouts", (req, res) => {
  db.create({
    // day: new Date(new Date().setDate(new Date().getDate())),
    // exercises: [],
  })
    .then((created) => {
      res.json(created);
    })
    .catch((err) => {
      res.json(err);
    });
});

// adds data to the exercises array

router.put("/api/workouts/:id", (req, res) => {
  db.updateOne(
    { _id: req.params.id },
    { $push: { exercises: req.body } },
    (error, success) => {
      if (error) {
        res.json(error);
      } else {
        res.json(success);
      }
    }
  );
});

// adds totalDuration to each

router.get("/api/workouts/range", (req, res) => {
  const d = new Date().setDate(new Date().getDate());
  db.aggregate(
    [
      // { $match: { day: { $gte: d } } },
      {
        $addFields: {
          totalDuration: {
            $reduce: {
              input: "$exercises",
              initialValue: 0,
              in: {
                $add: ["$$value", "$$this.duration"],
              },
            },
          },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.json(data);
      }
    }
  );
});

// routes to stats page

router.get("/stats", (req, res) => {
  res.redirect("/stats.html");
});

module.exports = router;