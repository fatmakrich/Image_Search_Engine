# Étape 1 : Utiliser une image Node.js comme base
FROM node:18-alpine

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires et installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : Copier le reste du code source
COPY . .

# Étape 5 : Exposer le port utilisé par le serveur
EXPOSE 5000

# Étape 6 : Commande pour démarrer l'application
CMD ["npm", "start"]
