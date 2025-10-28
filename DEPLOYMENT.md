# 🚀 Guide de Déploiement en Ligne

## 📋 Prérequis
- Compte GitHub
- Compte Railway (gratuit)
- Compte Vercel (gratuit)

## 🔧 Étape 1 : Déployer le Backend sur Railway

### 1.1 Créer le repository GitHub
1. Allez sur [github.com](https://github.com)
2. Cliquez sur "New repository"
3. Nom : `auction-platform`
4. Description : `Plateforme d'enchères en temps réel`
5. Public (pour Railway gratuit)
6. Créez le repository

### 1.2 Pousser le code sur GitHub
```bash
# Dans le terminal, depuis le dossier du projet
git remote add origin https://github.com/VOTRE_USERNAME/auction-platform.git
git branch -M main
git push -u origin main
```

### 1.3 Déployer sur Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez votre repository `auction-platform`
6. Sélectionnez le dossier `server` comme racine
7. Railway va automatiquement détecter que c'est un projet Node.js

### 1.4 Configurer les variables d'environnement sur Railway
Dans le dashboard Railway :
1. Allez dans "Variables"
2. Ajoutez :
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://votre-app-vercel.vercel.app` (vous l'obtiendrez après le déploiement frontend)

### 1.5 Obtenir l'URL du backend
Railway vous donnera une URL comme : `https://auction-platform-production.up.railway.app`

## 🎨 Étape 2 : Déployer le Frontend sur Vercel

### 2.1 Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Importez votre repository `auction-platform`
5. Sélectionnez le dossier `client` comme racine
6. Vercel détectera automatiquement React

### 2.2 Configurer les variables d'environnement sur Vercel
Dans le dashboard Vercel :
1. Allez dans "Settings" > "Environment Variables"
2. Ajoutez :
   - `REACT_APP_SOCKET_URL` = `https://votre-backend-railway.up.railway.app`

### 2.3 Obtenir l'URL du frontend
Vercel vous donnera une URL comme : `https://auction-platform-client.vercel.app`

## 🔄 Étape 3 : Finaliser la Configuration

### 3.1 Mettre à jour Railway avec l'URL du frontend
1. Retournez sur Railway
2. Allez dans "Variables"
3. Mettez à jour `FRONTEND_URL` avec l'URL Vercel

### 3.2 Redéployer les services
- Railway redéploiera automatiquement
- Vercel redéploiera automatiquement

## ✅ Étape 4 : Tester la Plateforme

### 4.1 URLs de test
- **Frontend** : `https://votre-app-vercel.vercel.app`
- **Admin** : `https://votre-app-vercel.vercel.app/admin`
- **Backend API** : `https://votre-backend-railway.up.railway.app/api/auctions`

### 4.2 Test complet
1. Allez sur l'URL admin
2. Créez une enchère test
3. Scannez le QR code avec votre téléphone
4. Testez les enchères en temps réel

## 🎯 URLs Finales

Une fois déployé, vous aurez :
- **Plateforme principale** : `https://votre-app-vercel.vercel.app`
- **Administration** : `https://votre-app-vercel.vercel.app/admin`
- **API Backend** : `https://votre-backend-railway.up.railway.app`

## 🔧 Dépannage

### Problème de CORS
Si vous avez des erreurs CORS, vérifiez que `FRONTEND_URL` sur Railway correspond exactement à votre URL Vercel.

### Problème de Socket.io
Vérifiez que `REACT_APP_SOCKET_URL` sur Vercel correspond à votre URL Railway.

### Problème de QR Code
Les QR codes doivent pointer vers votre URL Vercel, pas localhost.

## 💰 Coûts

- **Railway** : Gratuit jusqu'à 500h/mois
- **Vercel** : Gratuit pour les projets personnels
- **Total** : 0€/mois pour un usage normal

## 🚀 Avantages du Déploiement

✅ **Accessible partout** : Plus besoin d'être en local
✅ **QR Codes fonctionnels** : Scannables depuis n'importe où
✅ **Temps réel** : Socket.io fonctionne parfaitement
✅ **Mobile-friendly** : Optimisé pour les smartphones
✅ **Sécurisé** : HTTPS automatique
✅ **Rapide** : CDN mondial
✅ **Gratuit** : Aucun coût pour commencer
