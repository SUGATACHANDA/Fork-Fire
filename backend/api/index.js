const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('../config/db');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');

// Import Routers
const userRoutes = require('../routes/userRoutes');
const categoryRoutes = require('../routes/categoryRoutes');
const recipeRoutes = require('../routes/recipeRoutes');
const faqRoutes = require('../routes/faqRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes.js');
const newsletterRoutes = require('../routes/newsletterRoutes');
const commentRoutes = require('../routes/commentRoutes.js');


// Initial Setup
dotenv.config();
connectDB();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser for JSON

// API Info Route
app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Mount Routers
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/comments', commentRoutes);


// Make uploads folder static

// Custom Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));