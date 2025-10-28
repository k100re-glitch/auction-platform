# 🏆 Plateforme d'Enchères en Temps Réel

Une plateforme web moderne permettant d'organiser des enchères en temps réel avec QR codes pour faciliter la participation du public.

## ✨ Fonctionnalités

- **Interface d'administration** : Créer et gérer les enchères
- **QR Codes automatiques** : Génération automatique de QR codes pour chaque enchère
- **Enchères en temps réel** : Communication instantanée via Socket.io
- **Interface mobile-friendly** : Optimisée pour les smartphones des participants
- **Écran de projection** : Interface dédiée pour l'affichage public
- **Gestion des enchères** : Démarrage, suivi et fin des enchères

## 🚀 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
```bash
cd "Web App Enchère"
```

2. **Installer les dépendances**
```bash
# Installer les dépendances du projet principal
npm install

# Installer les dépendances du serveur
cd server
npm install

# Installer les dépendances du client
cd ../client
npm install
```

3. **Démarrer l'application**
```bash
# Depuis la racine du projet
npm run dev
```

Cette commande démarre :
- Le serveur Node.js sur le port 5000
- L'application React sur le port 3000

## 📱 Utilisation

### 1. Interface d'Administration
- Accédez à `http://localhost:3000/admin`
- Créez une nouvelle enchère avec :
  - Titre du produit
  - Description
  - Prix de départ
  - URL de l'image (optionnel)
- Un QR code est automatiquement généré

### 2. Participation aux Enchères
- Scannez le QR code avec votre smartphone
- Entrez votre nom
- Enchérissez en temps réel
- Suivez l'historique des enchères

### 3. Écran de Projection
- Accédez à `http://localhost:3000/display/[ID_ENCHERE]`
- Interface optimisée pour la projection
- Affichage en temps réel des enchères
- Animation lors des nouvelles enchères

## 🎯 Workflow Typique

1. **Préparation** :
   - L'organisateur crée l'enchère via l'interface admin
   - Le QR code est généré automatiquement

2. **Projection** :
   - Affichez l'écran de projection sur un grand écran
   - Le QR code est visible pour les participants

3. **Participation** :
   - Les participants scannent le QR code
   - Ils rejoignent l'enchère via leur smartphone

4. **Déroulement** :
   - L'administrateur démarre l'enchère
   - Les enchères apparaissent en temps réel sur l'écran
   - Les participants enchérissent via leur mobile

5. **Fin** :
   - L'administrateur termine l'enchère
   - Le gagnant est affiché sur l'écran

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** : Serveur JavaScript
- **Express** : Framework web
- **Socket.io** : Communication temps réel
- **QRCode** : Génération de QR codes
- **UUID** : Génération d'identifiants uniques

### Frontend
- **React** : Interface utilisateur
- **React Router** : Navigation
- **Socket.io Client** : Communication temps réel
- **QRCode.react** : Affichage des QR codes
- **Axios** : Requêtes HTTP

## 📁 Structure du Projet

```
Web App Enchère/
├── package.json              # Configuration principale
├── server/                   # Backend Node.js
│   ├── package.json
│   └── index.js             # Serveur principal
└── client/                  # Frontend React
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── index.css
        └── components/
            ├── Home.js
            ├── AdminDashboard.js
            ├── BidderInterface.js
            └── DisplayScreen.js
```

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env` dans le dossier `server/` si nécessaire :

```env
PORT=5000
NODE_ENV=development
```

### Personnalisation
- Modifiez les couleurs dans `client/src/index.css`
- Ajustez les durées d'enchères dans `server/index.js`
- Personnalisez les animations dans les composants React

## 🚀 Déploiement

### Production
1. Build de l'application React :
```bash
cd client
npm run build
```

2. Serveur de production :
```bash
cd server
npm start
```

### Docker (optionnel)
Créez un `Dockerfile` pour containeriser l'application.

## 🐛 Dépannage

### Problèmes courants
- **Port déjà utilisé** : Changez le port dans les fichiers de configuration
- **QR code ne fonctionne pas** : Vérifiez que l'URL est accessible
- **Connexion Socket.io** : Vérifiez que les deux serveurs sont démarrés

### Logs
- Les logs du serveur s'affichent dans la console
- Utilisez les outils de développement du navigateur pour déboguer le frontend

## 📞 Support

Pour toute question ou problème, consultez la documentation des technologies utilisées ou créez une issue sur le projet.

## 📄 Licence

MIT License - Libre d'utilisation et de modification.
