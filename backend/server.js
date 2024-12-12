const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cosineSimilarity = require('cosine-similarity');

const app = express();

// Enable CORS for all origins (or specify your frontend origin)
app.use(cors({
  origin: 'http://localhost:3000',  // Allow React app on localhost:3000
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware to handle JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure file upload with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create uploads directory if it doesn't exist
    }
    cb(null, uploadDir); // Set destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Fetch documents from Elasticsearch (assuming 'features' are stored here)
const fetchAllDocuments = async () => {
  try {
    const response = await axios.get('http://localhost:9200/projet_vgg/_search?pretty', {
      params: {
        query: {
          match_all: {} // Fetch all documents
        },
        size: 1000, // Fetch up to 10000 documents per scroll batch
      },
      auth: {
        username: 'elastic',
        password: 'rDGKmZHBYyJ4-lCee-yl', // Replace with your actual password
      }
    });
    
    // Debugging log to check the response structure
    console.log("Fetched documents:", response.data.hits.hits.length);

    const featuresList = response.data.hits.hits.map(doc => {
      const imageName = doc._source.image_name;
      const features = doc._source.features || []; // Default to an empty array if no features exist
      return { imageName, features };
    }).filter(doc => doc.features.length > 0); // Only include documents with valid features

    console.log("Filtered features:", featuresList.length); // Log filtered features list

    return featuresList; // Return the list of features
  } catch (error) {
    console.error('Error fetching documents from Elasticsearch:', error);
    return []; // Return empty if there's an error
  }
};

// Calculate cosine similarity between uploaded features and Elasticsearch features
const calculateCosineSimilarity = (uploadedFeatures, allFeatures) => {
  const similarities = allFeatures.map((doc) => {
    const similarity = cosineSimilarity(uploadedFeatures, doc.features);
    return { imageName: doc.imageName, similarity };
  });

  // Debugging log to check similarity scores
  console.log("Cosine Similarities:", similarities);

  // Sort by similarity (highest similarity first)
  similarities.sort((a, b) => b.similarity - a.similarity);

  // Return top 30 similar images
  return similarities.slice(0, 15);
};

// Convert image to base64 format (for displaying in React frontend)
const imageToBase64 = (imagePath) => {
  const file = fs.readFileSync(imagePath); // Read image file
  return `data:image/jpeg;base64,${file.toString('base64')}`; // Convert to base64
};

// Handle image upload and feature extraction
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const imgPath = req.file.path;

  // Run Python script to extract features from the uploaded image
  exec(`python feature_extractor.py ${imgPath}`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${stderr || error.message}`);
      return res.status(500).send('Error extracting features');
    }

    // Extract features from Python script output
    const uploadedFeatures = stdout.trim().replace(/\[|\]/g, '').split(',').map(Number);
    const cleanedUploadedFeatures = uploadedFeatures.map(f => (isNaN(f) ? 0 : f)); // Clean feature data

    // Debugging log to check uploaded features
    console.log("Uploaded features:", cleanedUploadedFeatures);

    // Fetch all features from Elasticsearch
    const allFeatures = await fetchAllDocuments();

    // Get top 30 similar images based on cosine similarity
    const top30Images = calculateCosineSimilarity(cleanedUploadedFeatures, allFeatures);

    // Get image data in base64 format
    const result = top30Images.map(img => {
      const imagePath = path.join(__dirname, 'images', img.imageName); // Path to image
      const imageBase64 = imageToBase64(imagePath); // Convert to base64
      return { 
        imageName: img.imageName, 
        similarity: img.similarity,
        imageBase64: imageBase64
      };
    });

    // Return the top 20 similar images as JSON response
    res.json({ topImages: result });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
