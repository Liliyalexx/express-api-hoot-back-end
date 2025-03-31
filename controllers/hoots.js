const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const router = express.Router();
//Post/hoots - CREATE Route "Protected"

// controllers/hoots.js


router.post("/", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hoot = await Hoot.create(req.body);
      hoot._doc.author = req.user;
      res.status(201).json(hoot);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
  //GET /hoots -READ Route"Protected
  router.get('/', verifyToken, async(req, res)=>{
    try {
        const hoots = await Hoot.find({})
        .populate("author")
        .sort({createdAt:"desc"});
        res.status(200).json(hoots);
     
    } catch (error) {
        console.log(error);
        res.status(500).json({err:err.message});
    }

  });

  //GET /hoots/:hootId
  router.get('/:hootId', verifyToken, async(req, res)=>{
    try {
        const hoot = await Hoot.findById(req.params.hootId)
        .populate('author');
        res.status(200).json(hoot);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
        
    }
  });
  //PUT /hoots/:hootId UPDATE Route "Protected"
  router.put('/:hootId', verifyToken, async(req, res)=>{
    try {
        const hoot = await Hoot.findById(req.params.hootId);

        //Check permission
        if(!hoot.author.equals(req.user._id)){
            return res.status(403).send("You are not allowed to do that!")
        }
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
            req.body,
            {new: true}
        );

        //{new true} return the document AFTER the update

        updatedHoot._doc.author = req.user // a grear alternative since 
        res.status(200).json(updatedHoot);
    } catch (error) {
        console.log(error);
        res.status(500).json({errer:error.message});
        
    }
  })

// controllers/hoots.js

router.delete("/:hootId", verifyToken, async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId);
  
      if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
      res.status(200).json(deletedHoot);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
module.exports =router;

