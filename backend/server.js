const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://prime-trade-assignment-shukla.vercel.app', process.env.FRONTEND_URL].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
app.use('/api/v1/tasks', require('./routes/v1/task.routes'));
app.use('/api/v1/users', require('./routes/v1/user.routes'));
app.use('/api/v1/notes', require('./routes/v1/note.routes'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Server is running'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
