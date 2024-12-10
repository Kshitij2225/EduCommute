const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGODB_URI


mongoose.connect(mongoURL, {
  dbName: "Institute_Vehicle_Track"
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Connection error:', err);
});

db.once('open', async () => {
  console.log("DB connected");

  try {
    const data = db.db.collection("drivers");
    console.log("drivers data collected");  

    const result = await data.find({}).toArray();
    // console.log(result)
    if (result) {
      global.data = result;
      // console.log(global.data)
      console.log('All data loaded');
    } else {
      console.log('No data found');
    }
  } catch (err) {
    console.error('Error fetching data:', err);
  }
});

module.exports = db;