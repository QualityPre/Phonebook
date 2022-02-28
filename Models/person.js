const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const url = process.env.MONGODB_URI;
console.log("connecting to database....", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to Mongo DB!");
  })
  .catch((error) => {
    console.log("error connecting to Mongo DB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    require: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
personSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Person", personSchema);
