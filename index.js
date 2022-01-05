const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { application } = require("express");
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("connected");
async function run() {
  try {
    await client.connect();
    const database = client.db("house_rent");
    const rentDatabase = database.collection("rent");

    //get api for houses
    app.get("/houses", async (req, res) => {
      const cursor = rentDatabase.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // post api add house rent

    app.post("/addHouse", async (req, res) => {
      // const services = req.body;
      console.log(req.body);
      const country = req.body.country;
      const city = req.body.city;
      const rent = req.body.rent;
      const description = req.body.description;
      const image = req.files.image;
      const picData = image.data;
      const encodedPic = picData.toString("base64");
      const imageBuffer = Buffer.from(encodedPic, "base64");
      const services = {
        country,
        city,
        rent,
        description,
        image: imageBuffer,
      };
      const result = await rentDatabase.insertOne(services);
      console.log("added", result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running the server");
});

app.listen(port, () => {
  console.log(`Listening from http://localhost:${port}`);
});
