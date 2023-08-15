require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

const app = express();
// Middleware

app.use(cors());

app.use(express.json());

// Database below

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@fsa-org.fjpwnfb.mongodb.net/?retryWrites=true&w=majority`;
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
    await client.connect();
    // Send a ping to confirm a successful connection
    const blogCollection = client.db("BlogDb").collection("Blogs");
    const deedCollection = client.db("DeedDb").collection("Deeds");
    const participatedVolunteerCollection = client
      .db("EventInformation")
      .collection("participatedVolunteers");
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      // hello
      res.send(blogs);
    });
    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = deedCollection.find(query);
      const deeds = await cursor.toArray();
      res.send(deeds);
    });
    app.get("/eventSelection", async (req, res) => {
      const query = {};
      const cursor = participatedVolunteerCollection.find(query);
      const participatedVolunteers = await cursor.toArray();
      res.send(participatedVolunteers);
    });
    app.post("/eventSelection", async (req, res) => {
      const data = req.body;
      const result = await participatedVolunteerCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/eventSelection/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await participatedVolunteerCollection.deleteOne(query);
      res.send(result);
      // console.log(result);
    });
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const blog = await blogCollection.findOne(query);
      //   const blog = await cursor.toArray();
      //   console.log(blog);
      if (blog) {
        res.send(blog);
      } else {
        console.log("err in data", id);
      }
    });
    console.log("DB is connected");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("FSA is running");
});

app.listen(port, () => {
  console.log("FSA Server is running", port);
});
