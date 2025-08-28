const Program = require('../models/program');

const createProgram = (req, res, next) => {
  const program = new Program({
    name: req.body.name,
    rating: req.body.rating,
    costPeerMinute: req.body.costPeerMinute,
  });
  program.save().then((createdProgram) => {
    res.status(201).json({
      message: 'Program added successfully',
      programId: createdProgram._id,
    });
  });
};

const getPrograms = (req, res, next) => {
  Program.find().then((documents) => {
    res.status(200).json({
      message: 'Programs  fetched successfully!',
      programs: documents,
    });
  });
};

const deleteProgram = (req, res, next) => {
  Program.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'Program deleted!' });
  });
};

module.exports = {
  createProgram,
  getPrograms,
  deleteProgram
};