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
    const profileCollection = client.db("ProfileDB").collection("users");
    const donationCollection = client.db("DonationDb").collection("Donations");
    const requestedParticipators = client
      .db("EventInformation")
      .collection("requestedVolunteers");
    const unverifiedDonationCollection = client
      .db("DonationDb")
      .collection("Unverfied");
    const participatedVolunteerCollection = client
      .db("EventInformation")
      .collection("participatedVolunteers");
    const completedVolunteerCollection = client
      .db("EventInformation")
      .collection("completedEvents");
    app.get("/donations", async (req, res) => {
      const query = {};
      const cursor = donationCollection.find(query);
      const blogs = await cursor.toArray();
      // hello
      res.send(blogs);
    });
    app.get("/unverified-donations", async (req, res) => {
      const query = {};
      const cursor = unverifiedDonationCollection.find(query);
      const blogs = await cursor.toArray();
      // hello
      res.send(blogs);
    });
    app.post("/donations", async (req, res) => {
      const data = req.body;
      const result = await donationCollection.insertOne(data);
      const query = { _id: new ObjectId(data._id) };

      const result1 = await unverifiedDonationCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/unverified-donations", async (req, res) => {
      const data = req.body;
      const result = await unverifiedDonationCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/unverified-donations/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await unverifiedDonationCollection.deleteOne(query);
      res.send(result);
      // console.log(result);
    });
    // have to blogs upddate  & delete api
    app.get("/blogs", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blogs = await cursor.toArray();
      // hello
      res.send(blogs);
    });
    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const data = await profileCollection.findOne(query);
      // hello
      res.send(data);
    });
    app.get("/participator/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = participatedVolunteerCollection.find(query);
      const data = await result.toArray();
      // hello
      res.send(data);
    });
    app.post("/profile", async (req, res) => {
      const data = req.body;
      const result = await profileCollection.insertOne(data);
      res.send(result);
    });
    app.post("/blogs", async (req, res) => {
      const data = req.body;
      const result = await blogCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
      // console.log(result);
    });
    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = deedCollection.find(query);
      const deeds = await cursor.toArray();
      res.send(deeds);
    });
    app.post("/events", async (req, res) => {
      const data = req.body;
      const result = await deedCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/events/:id", async (req, res) => {
      const id = req.params.id;
      console.log("event to be deleted", id);
      const query = { _id: new ObjectId(id) };
      const result = await deedCollection.deleteOne(query);
      res.send(result);
      console.log(result);
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
    app.get("/requestEvent", async (req, res) => {
      const query = {};
      const cursor = requestedParticipators.find(query);
      const participatedVolunteers = await cursor.toArray();
      res.send(participatedVolunteers);
    });
    app.get("/requestEvent/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = requestedParticipators.find(query);
      const participatedVolunteers = await cursor.toArray();
      res.send(participatedVolunteers);
    });
    app.post("/requestEvent", async (req, res) => {
      const data = req.body;
      const result = await requestedParticipators.insertOne(data);
      res.send(result);
    });
    app.delete("/requestEvent/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await requestedParticipators.deleteOne(query);
      res.send(result);
      // console.log(result);
    });
    // completed events volunteer list
    app.get("/completedEvent", async (req, res) => {
      const query = {};
      const cursor = completedVolunteerCollection.find(query);
      const participatedVolunteers = await cursor.toArray();
      res.send(participatedVolunteers);
      console.log("hello");
    });
    app.get("/completedEvent/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = completedVolunteerCollection.find(query);
      const participatedVolunteers = await cursor.toArray();
      res.send(participatedVolunteers);
    });
    app.post("/completedEvent", async (req, res) => {
      const data = req.body;
      const result = await completedVolunteerCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/completedEvent/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await completedVolunteerCollection.deleteOne(query);
      res.send(result);
      // console.log(result);
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
