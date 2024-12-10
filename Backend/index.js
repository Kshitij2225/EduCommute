const express = require('express');
require("dotenv").config();
const cors = require('cors');
const WebSocket = require('ws'); // Import ws library
const app = express();
const port = process.env.PORT || 5000;
const db = require('./mongoose');

const allowedOrigins = [
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('hello world');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.use(express.json());
app.use('/api', require('./Institute/NewInstitute'));
app.use('/api', require('./Student/NewStudent'));
app.use('/api', require('./Driver/NewDriver'));
app.use('/api', require('./Driver/DisplayData'));

const server = app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});


const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) => {
  console.log('New client connected');

  
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    ws.send(`You sent: ${message}`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
