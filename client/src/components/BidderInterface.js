import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const BidderInterface = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidderName, setBidderName] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuction();
    connectSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`/api/auctions/${auctionId}`);
      setAuction(response.data);
    } catch (error) {
      setError('Enchère non trouvée');
    }
  };

  const connectSocket = () => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('joinAuction', auctionId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('auctionData', (data) => {
      setAuction(data);
    });

    newSocket.on('newBid', (data) => {
      setAuction(data.auction);
    });

    newSocket.on('auctionFinished', (data) => {
      setAuction(data);
    });

    newSocket.on('error', (errorMessage) => {
      setError(errorMessage);
    });
  };

  const placeBid = (e) => {
    e.preventDefault();
    if (!bidderName.trim() || !bidAmount || !socket) return;

    const amount = parseFloat(bidAmount);
    if (amount <= auction.currentPrice) {
      setError('Votre enchère doit être supérieure au prix actuel');
      return;
    }

    socket.emit('placeBid', {
      auctionId,
      bidderId: Date.now().toString(), // ID simple basé sur le timestamp
      bidderName: bidderName.trim(),
      amount
    });

    setBidAmount('');
    setError('');
  };

  const getTimeRemaining = () => {
    if (!auction || !auction.endTime) return null;
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const diff = endTime - now;
    
    if (diff <= 0) return 'Terminé';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!auction) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="text-center">
          <h1>🏆 {auction.title}</h1>
          <p>{auction.description}</p>
          
          <div className="price" style={{fontSize: '32px', margin: '20px 0'}}>
            {auction.currentPrice}€
          </div>
          
          {auction.status === 'active' && auction.endTime && (
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#dc3545'}}>
              ⏰ {getTimeRemaining()}
            </div>
          )}
          
          <div style={{margin: '10px 0'}}>
            <span className={`status-${auction.status}`}>
              {auction.status === 'waiting' && '⏳ En attente'}
              {auction.status === 'active' && '🔥 En cours'}
              {auction.status === 'finished' && '✅ Terminée'}
            </span>
          </div>
        </div>

        {auction.imageUrl && (
          <img 
            src={auction.imageUrl} 
            alt={auction.title}
            style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '5px', margin: '20px 0'}}
          />
        )}

        {auction.status === 'active' && (
          <div className="card" style={{backgroundColor: '#f8f9fa'}}>
            <h3>💳 Faire une enchère</h3>
            
            <form onSubmit={placeBid}>
              <div className="form-group">
                <label>Votre nom</label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  placeholder="Entrez votre nom"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Montant de votre enchère (€)</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Minimum: ${auction.currentPrice + 1}€`}
                  min={auction.currentPrice + 1}
                  step="0.01"
                  required
                />
              </div>
              
              {error && (
                <div style={{color: '#dc3545', marginBottom: '15px'}}>
                  ⚠️ {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-success"
                style={{width: '100%', fontSize: '18px', padding: '15px'}}
              >
                🚀 Enchérir maintenant !
              </button>
            </form>
          </div>
        )}

        {auction.status === 'finished' && (
          <div className="card" style={{backgroundColor: '#d4edda'}}>
            <h3>🏁 Enchère terminée</h3>
            {auction.winner ? (
              <div>
                <p><strong>Gagnant:</strong> {auction.winner.bidderName}</p>
                <p><strong>Prix final:</strong> {auction.winner.amount}€</p>
              </div>
            ) : (
              <p>Aucune enchère n'a été faite</p>
            )}
          </div>
        )}

        {auction.status === 'waiting' && (
          <div className="card text-center">
            <h3>⏳ L'enchère n'a pas encore commencé</h3>
            <p>Revenez plus tard ou attendez que l'administrateur démarre l'enchère</p>
          </div>
        )}

        <div className="card">
          <h3>📊 Historique des enchères</h3>
          <div className="bid-history">
            {auction.bids.length === 0 ? (
              <p>Aucune enchère pour le moment</p>
            ) : (
              auction.bids.map((bid, index) => (
                <div key={bid.id} className="bid-item">
                  <div>
                    <strong>{bid.bidderName}</strong>
                    <br />
                    <small>{new Date(bid.timestamp).toLocaleTimeString()}</small>
                  </div>
                  <div style={{fontWeight: 'bold', color: '#28a745'}}>
                    {bid.amount}€
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center" style={{marginTop: '20px'}}>
          <div style={{fontSize: '12px', color: '#6c757d'}}>
            {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidderInterface;
