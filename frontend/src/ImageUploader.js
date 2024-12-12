import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploader.css';

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [topImages, setTopImages] = useState([]); // State to hold the top 30 similar images

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage('');
  };

  const onUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setIsLoading(true);

    try {
      // Upload the image to the backend for feature extraction
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Check the response and log it
      console.log('Top 30 Similar Images:', response.data.topImages);

      // Check if the data structure is correct
      if (response.data && response.data.topImages) {
        // Set the top 30 similar images in state to display
        setTopImages(response.data.topImages);
      } else {
        setErrorMessage('No similar images returned from the backend.');
      }
    } catch (error) {
      console.error('Error uploading image:', error.response || error.message); // Log the error for debugging
      setErrorMessage('An error occurred while uploading the image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Welcome To Image Search Engine </h1>
      <input
        type="file"
        id="file-upload"
        className="file-upload"
        onChange={onFileChange}
      />
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload file
      </label>
      {selectedFile && (
        <div className="uploaded-image">
          <h2>Uploaded Image:</h2>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Uploaded"
            className="thumbnail"
          />
        </div>
      )}
      <button onClick={onUpload} disabled={isLoading}>
        {isLoading ? 'Uploading...' : 'Similar Images'}
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {topImages.length > 0 && (
        <div className="results">
          <h2>Top 15 Similar Images:</h2>
          <div className="image-gallery">
            {topImages.map((img, index) => (
              <div key={index} className="image-item">
                {/* Directly use base64 encoded image */}
                <img
                  src={img.imageBase64} // Display the image directly from base64 data
                  alt={img.imageName}
                  className="similar-image"
                />
                <p><strong>{img.imageName}</strong> - Similarity: {img.similarity.toFixed(4)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
