const express = require("express");
const Note = require("../../models/Note");
const auth = require("../../middleware/auth");

const router = express.Router();

//Require login to use these routes
router.use(auth({ role: ["user"] }));

//GET all user's notes
router.get("/", async (req, res) => {
  Note.find({ user: req.user._id })
    .then(notes => {
      res.send(notes);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("An error occured");
    });
});

//GET a Note
router.get("/:noteID", async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteID);

    //Check that user has permission to access note
    if (req.user._id.equals(note.user) || note.isPublic) {
      return res.send(note);
    } else {
      return res.status(401).send("You are not authorized to view this note.");
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
});

//Add new note
router.post("/", async (req, res) => {
  try {
    const note = new Note({ user: req.user._id, ...req.body });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

//Update a note
router.put("/:noteID", async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.noteID,
        user: req.user._id
      },
      req.body,
      { new: true }
    )
      .then(doc => res.send(doc))
      .catch(err => {
        console.log(err);
        res.status(500).send("An error occurred.");
      });
  } catch (error) {
    console.log(err);
    res.status(500).send("An error occurred.");
  }
});

router.delete("/:noteID", async (req, res) => {

  Note.findOneAndDelete({ _id: req.params.noteID, user: req.user._id })
    .then(doc => res.status(200).send("Deleted!"))
    .catch(err => {
      res.status(400).send("Could not delete");
      console.log(err);
    });
});

module.exports = router;
