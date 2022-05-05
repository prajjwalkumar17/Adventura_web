const fs = require('fs');
const toursModel = require('./../../Models/tourModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//Read JSON
const toursToAdd = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB Connection sucessfull');
  });

//Import data into database

const importData = async () => {
  try {
    await toursModel.create(toursToAdd);
    console.log('Data Sucessfully added');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete all data from collection
const deletedata = async () => {
  try {
    await toursModel.deleteMany();
    console.log('Data Sucessfully Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deletedata();
}
console.log(process.argv);
