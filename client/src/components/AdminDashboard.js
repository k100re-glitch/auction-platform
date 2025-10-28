import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';

const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingPrice: '',
    imageUrl: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_SOCKET_URL || '';

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auctions`);
      const data = Array.isArray(response.data) ? response.data : [];
      setAuctions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des enchères:', error);
    }
  };

  const createAuction = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auctions`, newAuction);
      setAuctions([...(Array.isArray(auctions) ? auctions : []), response.data]);
      setNewAuction({ title: '', description: '', startingPrice: '', imageUrl: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const startAuction = async (auctionId) => {
    try {
      await axios.post(`${API_URL}/api/auctions/${auctionId}/start`);
      fetchAuctions();
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  };

  const finishAuction = async (auctionId) => {
    try {
      await axios.post(`${API_URL}/api/auctions/${auctionId}/finish`);
      fetchAuctions();
    } catch (error) {
      console.error('Erreur lors de la fin:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'status-waiting';
      case 'active': return 'status-active';
      case 'finished': return 'status-finished';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting': return 'En attente';
      case 'active': return 'En cours';
      case 'finished': return 'Terminée';
      default: return status;
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-20">
        <h1>🎯 Administration des Enchères</h1>
        <Link to="/" className="btn">← Retour à l'accueil</Link>
      </div>

      <div className="card">
        <div className="text-center">
          <button 
            className="btn btn-success"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Annuler' : '+ Créer une nouvelle enchère'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={createAuction} className="mt-20">
            <h3>Nouvelle Enchère</h3>
            <div className="form-group">
              <label>Titre du produit</label>
              <input
                type="text"
                value={newAuction.title}
                onChange={(e) => setNewAuction({...newAuction, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newAuction.description}
                onChange={(e) => setNewAuction({...newAuction, description: e.target.value})}
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Prix de départ (€)</label>
              <input
                type="number"
                value={newAuction.startingPrice}
                onChange={(e) => setNewAuction({...newAuction, startingPrice: e.target.value})}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label>URL de l'image</label>
              <input
                type="url"
                value={newAuction.imageUrl}
                onChange={(e) => setNewAuction({...newAuction, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <button type="submit" className="btn btn-success">
              Créer l'enchère
            </button>
          </form>
        )}
      </div>

      <div className="grid">
        {(Array.isArray(auctions) ? auctions : []).map(auction => (
          <div key={auction.id} className="card">
            <h3>{auction.title}</h3>
            <p><strong>Description:</strong> {auction.description}</p>
            <p><strong>Prix de départ:</strong> {auction.startingPrice}€</p>
            <p><strong>Prix actuel:</strong> <span className="price">{auction.currentPrice}€</span></p>
            <p><strong>Statut:</strong> <span className={getStatusColor(auction.status)}>
              {getStatusText(auction.status)}
            </span></p>
            
            {auction.imageUrl && (
              <img 
                src={auction.imageUrl} 
                alt={auction.title}
                style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', margin: '10px 0'}}
              />
            )}

            <div className="text-center mt-20">
              <QRCode 
                value={`${window.location.origin}/bid/${auction.id}`}
                size={150}
                style={{margin: '10px auto'}}
              />
              <p><small>QR Code pour les participants</small></p>
            </div>

            <div className="text-center mt-20">
              {auction.status === 'waiting' && (
                <button 
                  className="btn btn-success"
                  onClick={() => startAuction(auction.id)}
                >
                  Démarrer l'enchère
                </button>
              )}
              
              {auction.status === 'active' && (
                <div>
                  <Link 
                    to={`/display/${auction.id}`}
                    className="btn btn-warning"
                    target="_blank"
                  >
                    📺 Écran de projection
                  </Link>
                  <button 
                    className="btn btn-danger"
                    onClick={() => finishAuction(auction.id)}
                    style={{marginLeft: '10px'}}
                  >
                    Terminer l'enchère
                  </button>
                </div>
              )}
              
              {auction.status === 'finished' && auction.winner && (
                <div className="card" style={{backgroundColor: '#f8f9fa'}}>
                  <h4>🏆 Gagnant</h4>
                  <p><strong>{auction.winner.bidderName}</strong></p>
                  <p><strong>Prix final: {auction.winner.amount}€</strong></p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {auctions.length === 0 && (
        <div className="card text-center">
          <h3>Aucune enchère créée</h3>
          <p>Créez votre première enchère pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
