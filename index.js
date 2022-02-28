const express = require("express");
const app = express();
require("dotenv").config();

const Person = require("./Models/person");

// Middleware
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("build"));

var morgan = require("morgan");

// app.use(morgan("tiny"));

morgan.token("body", function (request, response) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello!</h1>");
});

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    response.send(`<p> The phonebook has enteries for ${
      result.length
    } people </p>
  <p> This information was requested at ${new Date()}`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  // const id = +request.params.id;
  // const person = persons.find((person) => person.id === id);
  Person.findById(request.params.id).then((person) => {
    if (person) response.json(person);
    else response.status(404).end();
  });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: "name and/or number missing",
  //   });
  // }

  // const check = persons.find((person) => person.name == body.name);
  // const check = Person.find({}).then((result) => {
  //   result.find((person) => {
  //     person.name === body.name;
  //   });
  // });

  // if (check) {
  //   return response.status(409).json({
  //     error: "This name has already been used!",
  //   });
  // }
  const newPerson = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });
  newPerson
    .save()
    .then((savednewPerson) => {
      response.json(savednewPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`${PORT} server is running on!`);
});
