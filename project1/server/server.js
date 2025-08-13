// express: tool to create web server with JS
// MongoDB: database
// MongoClient: connector between server and MongoDB

// import libraries
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

// create server (app)
const app = express();
app.use(cors()); // allow browser to accept requests from multiple sources frontend and backend
app.use(express.json());

// connect do DB
const client = new MongoClient(process.env.ATLAS_URI);
let photosCollection; // hold photos data
let isConnected = false;

async function connectDB() {
  try {
    await client.connect();
    photosCollection = client.db("projectTravelDiary").collection("photos"); // picks specific DB and collection
    isConnected = true;
    //console.log("✅ Connected to MongoDB");
  } catch (error) {
    //console.error("❌ MongoDB connection failed:", error);
    isConnected = false;
  }
}



// start server only after DB is connected
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
   // console.log(`Health check available at: http://localhost:${PORT}/health`);
  });
}).catch(error => {
  console.error("Failed to start server:", error);
  process.exit(1);
});





// Save photo URL
app.post("/save-photo", async (req, res) => {
  try {
    if (!isConnected) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const { url } = req.body; // extract url from request body
    if (!url) return res.status(400).json({ error: "URL is required" });

    // calls DB method to save new photo 
    const result = await photosCollection.insertOne({
      url,
      uploadedAt: new Date()
    });

    console.log("Photo saved:", result.insertedId);
    res.json({ message: "Photo saved", id: result.insertedId }); // sends confirmation to client
  } catch (err) {
    console.error("Error saving photo:", err);
    res.status(500).json({ error: "Failed to save photo" });
  }
});

// Get all photos
app.get('/photos', async (req, res) => {
  try {
    console.log("Fetching photos...");
    
    if (!isConnected) {
      console.log("Database not connected");
      return res.status(500).json({ error: "Database not connected" });
    }

    if (!photosCollection) {
      console.log("Photos collection not initialized");
      return res.status(500).json({ error: "Collection not initialized" });
    }

    const photos = await photosCollection.find({}).toArray();
    console.log(`Found ${photos.length} photos`);
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos: ' + error.message });
  }
});



app.delete('/deletephoto' ,async (req, res) => {
    try{

        console.log("Fetching photos...");
        
        if (!isConnected) {
        console.log("Database not connected");
        return res.status(500).json({ error: "Database not connected" });
        }

        if (!photosCollection) {
        console.log("Photos collection not initialized");
        return res.status(500).json({ error: "Collection not initialized" });
        }

        console.log("HERERERERE");
        
        const { id } = req.body; 
        console.log("photo to be deleted is "+ id)
        //const photo_to_delete = await photosCollection.find({url: id });
        const result = await photosCollection.deleteOne({ url: id});
        console.log("hahahaha")
        if (result.deletedCount == 1) {
            res.json({ message: "photo successfully deleted"});
        }
        else{
            res.status(404).json({error: "Photo not found"});
        }
    }
    catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Error deleting photo: ' + error.message });
  }
});



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoConnected: isConnected,
    timestamp: new Date().toISOString()
  });
});


// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

const PORT = process.env.PORT || 5000;