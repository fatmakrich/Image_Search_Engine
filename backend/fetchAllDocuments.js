const { Client } = require('@elastic/elasticsearch');

// Configuration du client Elasticsearch
const esClient = new Client({
    node: 'http://localhost:9200', // Vérifie que l'URL est correcte
    auth: {
        username: 'elastic', // Remplace par ton nom d'utilisateur
        password: 'rDGKmZHBYyJ4-lCee-yl' // Remplace par ton mot de passe
    }
});

const fetchAllDocuments = async () => {
    try {
        console.log('Fetching all documents from Elasticsearch...');

        const response = await esClient.search({
            index: 'projet_vgg',
            body: {
                query: {
                    match_all: {}
                },
                size: 1000
            }
        });

        // Log the full response for debugging
        console.log('Full Elasticsearch response:', JSON.stringify(response, null, 2));

        // Ensure the response has the expected structure
        if (response && response.body && response.body.hits) {
            console.log('Hits:', response.body.hits);

            if (response.body.hits.hits && response.body.hits.hits.length > 0) {
                const featuresList = [];

                response.body.hits.hits.forEach(doc => {
                    const imageName = doc._source.image_name;
                    const features = doc._source.features;
                    featuresList.push([imageName, features]);
                });

                console.log('Extracted features:', featuresList);
                return featuresList; // Return the featuresList
            } else {
                console.error('No actual hits found in the hits array.');
                return []; // Return an empty array if no hits found
            }
        } else {
            console.error('Response is undefined or invalid:', JSON.stringify(response, null, 2));
            return []; // Return an empty array in case of invalid response
        }
    } catch (error) {
        console.error('Error fetching documents from Elasticsearch:', error);
        if (error.meta && error.meta.body) {
            console.error('Error response from Elasticsearch:', JSON.stringify(error.meta.body, null, 2));
        }
        return []; // Return an empty array on error
    }
};


// Call the function to fetch documents
fetchAllDocuments();
