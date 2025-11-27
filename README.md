# PrimeTrade Task Management System

A professional full-stack task management application built with MERN stack, featuring JWT authentication, role-based access control, and modern UI/UX.

## Features

### Backend
- User authentication with JWT tokens
- Password hashing using bcrypt
- Role-based access control (Admin and User roles)
- RESTful API for task management
- Task assignment and tracking
- User statistics and analytics
- API versioning (v1)
- Input validation and sanitization
- Rate limiting for security
- Swagger API documentation
- Error handling middleware
- MongoDB database with Mongoose
- Security headers with Helmet
- CORS configuration

### Frontend
- React 19 with Vite build tool
- Modern glass-morphism UI design
- User authentication (Login/Register)
- Protected routes with JWT
- Admin dashboard with task management
- User dashboard with assigned tasks
- Real-time task statistics
- Task filtering by status and priority
- Responsive design for mobile and desktop
- Role-based navigation and features

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/shailendra-iiitm/PrimeTrade_Assignment>
cd primetrade_backend
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/PrimeTrade_backend
# JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
# JWT_EXPIRE=7d
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running:

**Local MongoDB:**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or using MongoDB Compass/Community Edition
```

**MongoDB Atlas (Cloud):**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `.env` file

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`
API Documentation: `http://localhost:5000/api-docs`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: "user" or "admin"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/v1/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high"
}
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>
```

#### Get Task Statistics
```http
GET /api/v1/tasks/stats
Authorization: Bearer <token>
```

### User Management (Admin Only)

#### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <admin-token>
```

#### Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /api/v1/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User
```http
DELETE /api/v1/users/:id
Authorization: Bearer <admin-token>
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Rate Limiting**: 
   - Auth endpoints: 5 requests per 15 minutes
   - API endpoints: 100 requests per 15 minutes
4. **Input Validation**: express-validator for all inputs
5. **Input Sanitization**: Prevention of NoSQL injection
6. **Security Headers**: Helmet.js for HTTP headers
7. **CORS**: Configured for specific origins

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required, max 50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed, min 6 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date (auto-generated)
}
```

### Task Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  status: String (enum: ['pending', 'in-progress', 'completed', 'on-hold']),
  priority: String (enum: ['low', 'medium', 'high', 'urgent']),
  assignedTo: ObjectId (ref: User, required),
  createdBy: ObjectId (ref: User, required),
  dueDate: Date (optional),
  completedAt: Date (optional),
  response: String (optional, user comments),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## 🏗️ Project Structure

```
primetrade_backend/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   └── v1/
│   │       ├── auth.routes.js
│   │       ├── task.routes.js
│   │       └── user.routes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Testing the Application

### Test Accounts

Admin Account:
- Email: shailendra@iiitmanipur.ac.in
- Password: Admin@1234
- Access: Full admin dashboard with user management

User Account:
- Email: amit@gmail.com
- Password: User@1234
- Access: User dashboard with assigned tasks

### 1. Login
- Navigate to `http://localhost:5173/login`
- Use one of the test accounts above
- Admin users are redirected to `/admin`
- Regular users are redirected to `/dashboard`

### 2. Register New User
- Navigate to `http://localhost:5173/register`
- Fill in the registration form
- New users are created with 'user' role by default

### 3. Task Management
- View all your tasks
- Filter by status and priority
- Create new tasks
- Edit existing tasks
- Delete tasks
- View task statistics

### 4. Test API with Swagger
- Visit `http://localhost:5000/api-docs`
- Test all endpoints interactively
- View request/response schemas

### 5. Test with Postman
- Import the Postman collection (if provided)
- Or manually test endpoints using the API documentation above

## 📈 Scalability Considerations

### Current Implementation
1. **Modular Architecture**: Separation of concerns (routes, controllers, models)
2. **API Versioning**: v1 prefix allows for future versions
3. **Database Indexing**: Optimized queries on frequently accessed fields
4. **Error Handling**: Centralized error management
5. **Rate Limiting**: Prevents abuse and DDoS attacks

### Future Scalability Strategies

#### 1. Caching Layer (Redis)
```javascript
// Cache frequently accessed data
- User sessions
- Task lists
- Dashboard statistics
- Reduce database load by 60-80%
```

#### 2. Microservices Architecture
```
Current: Monolithic
Future: 
  - Auth Service (handles authentication)
  - Task Service (handles task CRUD)
  - User Service (handles user management)
  - API Gateway (routes requests)
```

#### 3. Load Balancing
```
- Nginx/HAProxy for distributing traffic
- Multiple Node.js instances
- PM2 cluster mode for process management
```

#### 4. Database Optimization
```
- Database sharding for large datasets
- Read replicas for read-heavy operations
- Connection pooling
- Query optimization and indexing
```

#### 5. Container Orchestration (Docker + Kubernetes)
```yaml
# Docker Compose for development
# Kubernetes for production
- Auto-scaling based on load
- Self-healing containers
- Zero-downtime deployments
```

#### 6. Message Queue (RabbitMQ/Kafka)
```
- Asynchronous task processing
- Email notifications
- Background jobs
- Event-driven architecture
```

#### 7. CDN & Static Asset Optimization
```
- CloudFront/Cloudflare for static assets
- Image optimization
- Lazy loading
- Code splitting
```

#### 8. Monitoring & Logging
```
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana
- Application Performance Monitoring (New Relic, DataDog)
- Error tracking (Sentry)
```

#### 9. Security Enhancements
```
- OAuth 2.0 integration
- Two-factor authentication
- API key management
- IP whitelisting
- DDoS protection (Cloudflare)
```

#### 10. Testing & CI/CD
```
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)
- GitHub Actions/Jenkins for CI/CD
- Automated deployments
```

## Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET (min 32 characters)
   - Configure production MongoDB URI
   - Set appropriate CORS origins

2. **Security**
   - Enable HTTPS only
   - Configure rate limiting
   - Set secure cookie flags
   - Update CORS to production domains

3. **Database**
   - Use MongoDB Atlas (recommended)
   - Enable IP whitelist
   - Configure database backups
   - Set up connection pooling

### Backend Deployment (Recommended: Render/Railway)

```bash
# Build command
npm install

# Start command
npm start

# Environment variables to set:
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend Deployment (Recommended: Vercel/Netlify)

```bash
# Build command
npm run build

# Output directory
dist

# Update API URL in production
# frontend/src/api/axios.js
const API_URL = import.meta.env.PROD 
  ? 'https://your-backend.onrender.com/api/v1'
  : 'http://localhost:5000/api/v1';
```

### Database
- MongoDB Atlas (Free tier available)
- Create cluster and whitelist deployment IPs
- Connection string format:
  `mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>`

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
net start MongoDB

# Verify connection string in .env
MONGODB_URI=mongodb://localhost:27017/primetrade
```

### CORS Errors
```javascript
// Update backend/server.js
cors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

## 📝 License

This project is created for the PrimeTrade Backend Developer Internship assignment.

## 👤 Author

**Your Name**
- Email: your.email@example.com
- GitHub: @yourusername

## 🙏 Acknowledgments

- PrimeTrade.ai for the internship opportunity
- MERN stack community
- All open-source contributors

---

**Note**: This is a demo project for educational and evaluation purposes. For production use, implement additional security measures, comprehensive testing, and monitoring.
