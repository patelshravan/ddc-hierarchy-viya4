const express = require('express');
const path = require('path');
const app = express();
const config = require('./config');
const ddcRouter = require('./routes/ddc');
const cors = require('cors');
// Set view engine and views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse JSON bodies (must be before routes)
app.use(express.json());
app.use(cors());

// Serve static files
app.use(config.baseUrl + '/static', express.static(path.join(__dirname, 'public/static')));

app.use(config.baseUrl + '/libs', express.static(path.join(__dirname, 'lib')));

// Mount routes
app.use(config.baseUrl, ddcRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DDC server listening on http://localhost:${PORT}${config.baseUrl}`);
});