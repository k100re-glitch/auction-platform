import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="text-center mt-20">
        <h1>🏆 Plateforme d'Enchères</h1>
        <p>Gérez et participez aux enchères en temps réel</p>
        
        <div className="grid mt-20">
          <div className="card">
            <h3>Administration</h3>
            <p>Créez et gérez vos enchères</p>
            <Link to="/admin" className="btn">
              Accéder à l'administration
            </Link>
          </div>
          
          <div className="card">
            <h3>Scanner QR Code</h3>
            <p>Scannez le QR code pour participer à une enchère</p>
            <p className="text-center">
              📱 Utilisez votre appareil photo pour scanner le QR code affiché
            </p>
          </div>
        </div>
        
        <div className="card mt-20">
          <h3>Comment ça marche ?</h3>
          <div className="grid">
            <div>
              <h4>1. Création d'enchère</h4>
              <p>L'administrateur crée une enchère avec les détails du produit</p>
            </div>
            <div>
              <h4>2. QR Code</h4>
              <p>Un QR code est généré pour permettre aux participants de rejoindre</p>
            </div>
            <div>
              <h4>3. Enchères en direct</h4>
              <p>Les participants enchérissent en temps réel via leur mobile</p>
            </div>
            <div>
              <h4>4. Projection</h4>
              <p>L'écran de projection affiche les enchères en direct</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
