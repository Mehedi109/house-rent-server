const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const { application } = require("express");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

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
    const contactCollection = database.collection("contact");
    const ordersCollection = database.collection("order");
    const reviewsCollection = database.collection("review");
    const usersCollection = database.collection("users");

    //get api for house
    app.get("/houses", async (req, res) => {
      const cursor = rentDatabase.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get api for specific house
    app.get("/houses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await rentDatabase.findOne(query);
      res.send(result);
    });

    // post api of houses
    app.post("/addHouse", async (req, res) => {
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
      console.log(result);
      res.json(result);
    });

    // delete api of houses
    app.delete("/houses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await rentDatabase.deleteOne(query);
      res.send(result);
    });

    // post api of contact
    app.post("/contact", async (req, res) => {
      const contact = req.body;
      const result = await contactCollection.insertOne(contact);
      console.log(result);
      res.json(result);
    });

    // get api of contact
    app.get("/contact", async (req, res) => {
      const getContact = contactCollection.find({});
      const result = await getContact.toArray();
      res.json(result);
    });

    // post api of order
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    // get api of orders
    app.get("/orders", async (req, res) => {
      const orders = ordersCollection.find({});
      const result = await orders.toArray();
      res.json(result);
    });

    // delete api of order
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // post api of review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    // get api of reviews
    app.get("/reviews", async (req, res) => {
      const reviews = reviewsCollection.find({});
      const result = await reviews.toArray();
      res.json(result);
    });

    // post api for users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const cursor = await usersCollection.insertOne(user);
      res.send(cursor);
    });

    // get api of users
    app.get("/users", async (req, res) => {
      const users = usersCollection.find({});
      const result = await users.toArray();
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // put api of admin role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Listening from http://localhost:${port}`);
});
