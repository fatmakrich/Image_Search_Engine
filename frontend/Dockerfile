# Étape 1 : Utiliser une image Node.js comme base
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires et installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : Copier le reste du projet et construire les fichiers optimisés
COPY . .
RUN npm run build

# Étape 5 : Exposer le port 3000
EXPOSE 3000

# Étape 6 : Commande pour lancer le serveur en production
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
