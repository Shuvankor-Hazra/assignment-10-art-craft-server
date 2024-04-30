const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fi65pdm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftsCollection = client.db("craftsDB").collection("crafts");
    const subCraftsCollection = client.db("craftsDB").collection("subCrafts");

    app.get("/crafts", async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/subCrafts", async (req, res) => {
      const cursor = subCraftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myCrafts/:subcategoryName", async (req, res) => {
      const id = req.params.subcategoryName;
      const query = { subcategoryName:id };
      const result = await craftsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/myArtCraft/:email", async (req, res) => {
      const id = req.params.email;
      const query = { userEmail:id };
      const result = await craftsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const craft = await craftsCollection.findOne(query);
      res.send(craft);
    });

    app.post("/crafts", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftsCollection.insertOne(newCraft);
      res.send(result);
    });

    //Users


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ok, Assignment 10 art & craft is running");
});

app.listen(port, () => {
  console.log(`ok - Assignment 10 art & craft is running: ${port}`);
});
