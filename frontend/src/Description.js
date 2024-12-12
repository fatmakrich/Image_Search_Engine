// Description.js
import React from 'react';
import './Description.css';

// Importation correcte de l'image (si l'image est dans le même dossier)
import architectureImage from './architecture.png';  // Notez l'utilisation de './'

const Description = () => (
  <section id="description" className="description-section">
    <div className="description-text">
      <h2>Technical Description</h2>
      <p>
        This project focuses on building an advanced image search engine using deep learning and Elasticsearch.
        Image features are extracted with the VGG16 model, a pre-trained convolutional neural network, converting images into high-dimensional feature vectors. These vectors are indexed and stored in Elasticsearch, enabling efficient retrieval.
      </p>
      <p>
        The system compares the feature vector of an uploaded image with those in the database using cosine similarity, identifying and ranking visually similar images. This approach combines the power of feature extraction with scalable search technology to deliver a robust image retrieval solution.
      </p>
    </div>
    {/* Utilisation de l'image importée */}
    <img src={architectureImage} alt="Technical Workflow" className="description-image" />
  </section>
);

export default Description;
