const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { application } = require("express");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("house_rent");
    const rentDatabase = database.collection("rent");

    //get api for rent
    app.get("/rent", async (req, res) => {
      const cursor = rentDatabase.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // delete api of houses
    app.delete("/houses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await rentDatabaseCollection.deleteOne(query);
      res.send(result);
    });

    // post api add house rent

    app.post("/rent", async (req, res) => {
      const servieces = req.body;
      const result = await rentDatabase.insertOne(servieces);
      console.log("hited", result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hellow world");
});

app.listen(port, () => {
  console.log(`Lisning from http://localhost:${port}`);
});
