const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

app.get(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hellow world");
});

app.listen(port, () => {
  console.log(`Lisning from http://localhost:${port}/`);
});
