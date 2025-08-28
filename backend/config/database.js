const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://ndrzhevetskyi:qI0mSu9uuAUhQbHc@cluster0.nv3ecdt.mongodb.net/tv-advertisement?retryWrites=true&w=majority&appName=Cluster0');
    console.log('connected to database!');
  } catch (error) {
    console.log('connection Failed!');
    process.exit(1);
  }
};

module.exports = connectDB;