const express = require("express");
const app = express();
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
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`<p> The phonebook has enteries for ${
    persons.length
  } people </p>
  <p> This information was requested at ${new Date()}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) response.json(person);
  else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and/or number missing",
    });
  }

  const check = persons.find((person) => person.name == body.name);

  if (check) {
    return response.status(409).json({
      error: "This name has already been used!",
    });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: getRandomInt(5, 10000),
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`${PORT} server is running on!`);
});
