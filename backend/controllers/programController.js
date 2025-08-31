const Program = require('../models/program');

const createProgram = (req, res, next) => {
  const program = new Program({
    name: req.body.name,
    rating: req.body.rating,
    costPeerMinute: req.body.costPeerMinute,
  });
  program
    .save()
    .then((createdProgram) => {
      res.status(201).json({
        message: 'Program added successfully',
        programId: createdProgram._id,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Creating program failed!',
        error: error,
      });
    });
};

const getPrograms = (req, res, next) => {
//   console.log('Query params:', req.query);

  const pageSize = +req.query.pagesize || 5;
  const currentPage = +req.query.page || 1;

//   console.log(`Pagination: pageSize=${pageSize}, currentPage=${currentPage}`);

  const programQuery = Program.find();
  let fetchedPrograms;

  // Calculate skip value - this was the main issue
  const skipValue = pageSize * (currentPage - 1);
  //   console.log(`Skip value: ${skipValue}`);

  if (pageSize && currentPage) {
    programQuery.skip(skipValue).limit(pageSize);
  }

  programQuery
    .then((documents) => {
      fetchedPrograms = documents;
    //   console.log(`Found ${documents.length} programs`);
      return Program.countDocuments();
    })
    .then((count) => {
    //   console.log(`Total programs in database: ${count}`);
      res.status(200).json({
        message: 'Programs fetched successfully!',
        programs: fetchedPrograms,
        maxPrograms: count,
      });
    })
    .catch((error) => {
      console.error('Error fetching programs:', error);
      res.status(500).json({
        message: 'Fetching programs failed!',
        error: error,
      });
    });
};

const deleteProgram = (req, res, next) => {
  Program.deleteOne({ _id: req.params.id })
    .then((result) => {
    //   console.log('Delete result:', result);
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: 'Program deleted successfully!',
        });
      } else {
        res.status(404).json({
          message: 'Program not found!',
        });
      }
    })
    .catch((error) => {
      console.error('Error deleting program:', error);
      res.status(500).json({
        message: 'Deleting program failed!',
        error: error,
      });
    });
};

const updateProgram = (req, res, next) => {
  const program = new Program({
    _id: req.body.id,
    name: req.body.name,
    costPeerMinute: req.body.costPeerMinute,
  });
  Program.updateOne({ _id: req.params.id }, program).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'Update successfull!' });
  });
};

module.exports = {
  createProgram,
  getPrograms,
  deleteProgram,
  updateProgram,
};
