# Backend API - PrimeTrade

RESTful API with authentication, role-based access control, and task management.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
copy .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file with the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Protected)

### Tasks
- `GET /api/v1/tasks` - Get all tasks (Protected)
- `GET /api/v1/tasks/:id` - Get single task (Protected)
- `POST /api/v1/tasks` - Create task (Protected)
- `PUT /api/v1/tasks/:id` - Update task (Protected)
- `DELETE /api/v1/tasks/:id` - Delete task (Protected)
- `GET /api/v1/tasks/stats` - Get task statistics (Protected)

### Users (Admin Only)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## API Documentation

Visit `http://localhost:5000/api-docs` when the server is running to see Swagger documentation.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- Security headers (Helmet)
- CORS protection

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Swagger
