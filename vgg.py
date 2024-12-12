import os
from elasticsearch import Elasticsearch
from PIL import Image
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.models import Model

class FeatureExtractor:
    def __init__(self):
        # Charger le modèle VGG16 pré-entraîné
        base_model = VGG16(weights='imagenet')
        # Extraire les caractéristiques de la couche fc1
        self.model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)

    def extract(self, img_path):
        # Charger l'image avec la taille cible de 224x224
        print(f"Loading image from {img_path}")
        img = image.load_img(img_path, target_size=(224, 224))
        img = img.convert('RGB')  # Assurer que l'image est au format RGB
        x = image.img_to_array(img)  # Convertir l'image en tableau numpy
        x = np.expand_dims(x, axis=0)  # Étendre les dimensions pour correspondre à l'entrée du modèle
        x = preprocess_input(x)  # Prétraiter l'image

        # Extraire les caractéristiques
        print("Extracting features using VGG16 model...")
        feature = self.model.predict(x)[0]  # Prédire les caractéristiques
        
        # Normaliser le vecteur de caractéristiques
        norm = np.linalg.norm(feature)
        normalized_feature = feature / norm if norm != 0 else np.zeros_like(feature)  # Éviter la division par zéro
        print("Feature extraction complete.")
        return normalized_feature

# Initialiser Elasticsearch
es = Elasticsearch(
    hosts=[{
        'host': 'localhost',
        'port': 9200,
        'scheme': 'http',
    }],
    http_auth=('elastic', 'rDGKmZHBYyJ4-lCee-yl')
)

# Nom de l'index
index_name = 'project_vgg'
if not es.indices.exists(index=index_name):
    es.indices.create(index=index_name)

# Chemin du dossier d'images
IMAGE_DIR = 'images'

# Lister les chemins des images dans tous les sous-dossiers
imagePaths = []
for dirpath, dirnames, filenames in os.walk(IMAGE_DIR):
    for filename in filenames:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):  # Filtrer les types d'images
            imagePaths.append(os.path.join(dirpath, filename))

# Extraire les caractéristiques et envoyer à Elasticsearch
fe = FeatureExtractor()  # Créer une instance de FeatureExtractor

for (i, imagePath) in enumerate(imagePaths):
    print(f"[INFO] Traitement de l'image {i + 1}/{len(imagePaths)}")
    
    # Obtenir le nom du fichier de l'image
    image_name = os.path.basename(imagePath)  # Nom du fichier sans le chemin
    
    # Extraire les caractéristiques
    featuredb = fe.extract(imagePath)
    
    # Préparer le document à indexer
    document = {
        'image_name': image_name,
        'features': featuredb.tolist()  # Convertir le tableau numpy en liste
    }
    
    # Indexer le document dans Elasticsearch
    try:
        es.index(index=index_name, body=document)
        print(f"[INFO] Indexed document for {image_name}")
    except Exception as e:
        print(f"[ERROR] Failed to index {image_name}: {e}")

print("[INFO] Extraction des caractéristiques et indexation terminées.")
