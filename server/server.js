const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/miningserver', require('./routes/api/miningserver'));
app.use('/api/faq', require('./routes/api/faq'));
app.use('/api/password', require('./routes/api/password'));

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.join(__dirname, '..', 'build', 'index.html')
    );
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});