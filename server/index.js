const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Stockage en mémoire (en production, utiliser une base de données)
let auctions = new Map();
let bidders = new Map();

// Structure d'une enchère
class Auction {
  constructor(id, title, description, startingPrice, imageUrl) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startingPrice = startingPrice;
    this.currentPrice = startingPrice;
    this.imageUrl = imageUrl;
    this.status = 'waiting'; // waiting, active, finished
    this.bids = [];
    this.winner = null;
    this.endTime = null;
    this.qrCodeUrl = null;
  }

  addBid(bidderId, amount, bidderName) {
    if (this.status !== 'active') return false;
    if (amount <= this.currentPrice) return false;
    
    const bid = {
      id: uuidv4(),
      bidderId,
      bidderName,
      amount,
      timestamp: new Date()
    };
    
    this.bids.push(bid);
    this.currentPrice = amount;
    return bid;
  }

  start() {
    this.status = 'active';
    this.endTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  }

  finish() {
    this.status = 'finished';
    if (this.bids.length > 0) {
      this.winner = this.bids[this.bids.length - 1];
    }
  }
}

// Routes API
app.get('/api/auctions', (req, res) => {
  res.json(Array.from(auctions.values()));
});

app.post('/api/auctions', async (req, res) => {
  const { title, description, startingPrice, imageUrl } = req.body;
  const auctionId = uuidv4();
  
  const auction = new Auction(auctionId, title, description, startingPrice, imageUrl);
  
  // Générer le QR code
  const qrData = `${FRONTEND_URL}/bid/${auctionId}`;
  auction.qrCodeUrl = await QRCode.toDataURL(qrData);
  
  auctions.set(auctionId, auction);
  
  res.json(auction);
});

app.get('/api/auctions/:id', (req, res) => {
  const auction = auctions.get(req.params.id);
  if (!auction) {
    return res.status(404).json({ error: 'Enchère non trouvée' });
  }
  res.json(auction);
});

app.post('/api/auctions/:id/start', (req, res) => {
  const auction = auctions.get(req.params.id);
  if (!auction) {
    return res.status(404).json({ error: 'Enchère non trouvée' });
  }
  
  auction.start();
  io.emit('auctionStarted', auction);
  res.json(auction);
});

app.post('/api/auctions/:id/finish', (req, res) => {
  const auction = auctions.get(req.params.id);
  if (!auction) {
    return res.status(404).json({ error: 'Enchère non trouvée' });
  }
  
  auction.finish();
  io.emit('auctionFinished', auction);
  res.json(auction);
});

// Socket.io pour la communication en temps réel
io.on('connection', (socket) => {
  console.log('Utilisateur connecté:', socket.id);

  socket.on('joinAuction', (auctionId) => {
    socket.join(auctionId);
    const auction = auctions.get(auctionId);
    if (auction) {
      socket.emit('auctionData', auction);
    }
  });

  socket.on('placeBid', (data) => {
    const { auctionId, bidderId, bidderName, amount } = data;
    const auction = auctions.get(auctionId);
    
    if (!auction) {
      socket.emit('error', 'Enchère non trouvée');
      return;
    }

    const bid = auction.addBid(bidderId, amount, bidderName);
    if (bid) {
      io.to(auctionId).emit('newBid', {
        auction: auction,
        bid: bid
      });
    } else {
      socket.emit('error', 'Enchère invalide');
    }
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
  });
});

// Ajouter un endpoint de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Serveur d\'enchères démarré avec succès!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
