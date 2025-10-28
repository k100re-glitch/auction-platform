import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const DisplayScreen = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchAuction();
    connectSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [auctionId]);

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`/api/auctions/${auctionId}`);
      setAuction(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'enchère:', error);
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
      // Animation pour la nouvelle enchère
      animateNewBid();
    });

    newSocket.on('auctionFinished', (data) => {
      setAuction(data);
    });
  };

  const animateNewBid = () => {
    // Animation simple pour attirer l'attention
    const priceElement = document.querySelector('.current-price');
    if (priceElement) {
      priceElement.style.transform = 'scale(1.2)';
      priceElement.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        priceElement.style.transform = 'scale(1)';
      }, 300);
    }
  };

  const getTimeRemaining = () => {
    if (!auction || !auction.endTime) return null;
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const diff = endTime - now;
    
    if (diff <= 0) return 'TERMINÉ';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (!auction) return '';
    
    switch (auction.status) {
      case 'waiting': return 'EN ATTENTE';
      case 'active': return 'EN COURS';
      case 'finished': return 'TERMINÉE';
      default: return '';
    }
  };

  const getStatusColor = () => {
    if (!auction) return '#6c757d';
    
    switch (auction.status) {
      case 'waiting': return '#6c757d';
      case 'active': return '#28a745';
      case 'finished': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (!auction) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        fontSize: '24px'
      }}>
        Chargement de l'enchère...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* En-tête */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        borderBottom: '3px solid #fff',
        paddingBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0',
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}>
          🏆 {auction.title}
        </h1>
        
        <div style={{
          fontSize: '24px',
          margin: '20px 0',
          color: getStatusColor(),
          fontWeight: 'bold'
        }}>
          {getStatusText()}
        </div>
        
        {auction.status === 'active' && auction.endTime && (
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ffc107',
            margin: '20px 0'
          }}>
            ⏰ {getTimeRemaining()}
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Image du produit */}
        <div style={{ textAlign: 'center' }}>
          {auction.imageUrl && (
            <img 
              src={auction.imageUrl} 
              alt={auction.title}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '3px solid #fff'
              }}
            />
          )}
          
          <div style={{
            marginTop: '20px',
            fontSize: '20px',
            lineHeight: '1.5'
          }}>
            {auction.description}
          </div>
        </div>

        {/* Prix et enchères */}
        <div>
          {/* Prix actuel */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              fontSize: '18px',
              marginBottom: '10px',
              opacity: 0.8
            }}>
              PRIX ACTUEL
            </div>
            <div className="current-price" style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#28a745',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {auction.currentPrice}€
            </div>
            <div style={{
              fontSize: '16px',
              marginTop: '10px',
              opacity: 0.7
            }}>
              Prix de départ: {auction.startingPrice}€
            </div>
          </div>

          {/* Historique des enchères */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '20px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center',
              borderBottom: '2px solid #fff',
              paddingBottom: '10px'
            }}>
              📊 DERNIÈRES ENCHÈRES
            </h3>
            
            {auction.bids.length === 0 ? (
              <div style={{
                textAlign: 'center',
                fontSize: '18px',
                opacity: 0.7,
                padding: '40px 0'
              }}>
                Aucune enchère pour le moment
              </div>
            ) : (
              auction.bids.slice(-10).reverse().map((bid, index) => (
                <div key={bid.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px 0',
                  borderBottom: index < auction.bids.slice(-10).length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                  backgroundColor: index === 0 ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
                  borderRadius: index === 0 ? '5px' : '0',
                  padding: '15px',
                  margin: index === 0 ? '0 0 10px 0' : '0'
                }}>
                  <div>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      {bid.bidderName}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      opacity: 0.7
                    }}>
                      {new Date(bid.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#28a745'
                  }}>
                    {bid.amount}€
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Gagnant si terminé */}
      {auction.status === 'finished' && auction.winner && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(40, 167, 69, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '5px solid #fff',
          zIndex: 1000
        }}>
          <h2 style={{
            fontSize: '48px',
            margin: '0 0 20px 0',
            color: '#fff'
          }}>
            🏆 GAGNANT !
          </h2>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            {auction.winner.bidderName}
          </div>
          <div style={{
            fontSize: '28px',
            opacity: 0.9
          }}>
            Prix final: {auction.winner.amount}€
          </div>
        </div>
      )}

      {/* Indicateur de connexion */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        fontSize: '14px',
        opacity: 0.7
      }}>
        {isConnected ? '🟢 Connecté' : '🔴 Déconnecté'}
      </div>
    </div>
  );
};

export default DisplayScreen;
