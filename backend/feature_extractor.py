import sys
import numpy as np
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model
import tensorflow as tf

def extract_features(img_path):
    # Charger le modèle VGG16 pré-entraîné
    base_model = VGG16(weights='imagenet')
    model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)

    # Charger l'image et la préparer pour le modèle
    img = image.load_img(img_path, target_size=(224, 224))
    img = img.convert('RGB')
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    # Extraire les caractéristiques
    features = model.predict(x)[0]

    # Normaliser les caractéristiques
    norm = np.linalg.norm(features)
    normalized_features = features / norm if norm != 0 else np.zeros_like(features)

    return normalized_features

# Le chemin de l'image est passé en argument
if __name__ == "__main__":
    img_path = sys.argv[1]
    features = extract_features(img_path)
    
    # Afficher les caractéristiques sous forme de liste
    print(features.tolist())
