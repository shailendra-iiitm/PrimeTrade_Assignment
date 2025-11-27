# API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://your-backend-url.com/api/v1
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "user"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:** Same as register

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2025-11-27T00:00:00.000Z"
    }
  }
}
```

### Tasks

#### Get All Tasks
```http
GET /tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <token>
```

Query Parameters:
- `status` (optional): pending, in-progress, completed, on-hold
- `priority` (optional): low, medium, high, urgent
- `assignedTo` (optional, admin only): user ID
- `page` (optional): page number (default: 1)
- `limit` (optional): items per page (default: 10)
- `sortBy` (optional): field to sort by (default: -createdAt)

**Response:**
```json
{
  "status": "success",
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": {
    "tasks": [
      {
        "_id": "task-id",
        "title": "Task Title",
        "description": "Task Description",
        "status": "pending",
        "priority": "high",
        "assignedTo": {
          "_id": "user-id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "createdBy": {
          "_id": "admin-id",
          "name": "Admin Name",
          "email": "admin@example.com"
        },
        "dueDate": "2025-12-01T00:00:00.000Z",
        "response": "User response here",
        "createdAt": "2025-11-27T00:00:00.000Z",
        "updatedAt": "2025-11-27T00:00:00.000Z"
      }
    ]
  }
}
```

#### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Create Task (Admin Only)
```http
POST /tasks
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "status": "pending",
  "priority": "high",
  "assignedTo": "user-id",
  "dueDate": "2025-12-01T00:00:00.000Z"
}
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "response": "Working on this task"
}
```

Note: Regular users can only update status and response fields for their assigned tasks.

#### Delete Task (Admin Only)
```http
DELETE /tasks/:id
Authorization: Bearer <admin-token>
```

#### Get Task Statistics
```http
GET /tasks/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 50,
    "overdue": 5,
    "completedThisWeek": 10,
    "byStatus": [
      { "_id": "pending", "count": 20 },
      { "_id": "in-progress", "count": 15 },
      { "_id": "completed", "count": 15 }
    ],
    "byPriority": [
      { "_id": "low", "count": 10 },
      { "_id": "medium", "count": 20 },
      { "_id": "high", "count": 15 },
      { "_id": "urgent", "count": 5 }
    ]
  }
}
```

#### Get Admin Analytics (Admin Only)
```http
GET /tasks/analytics
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalTasks": 50,
    "totalUsers": 10,
    "tasksByUser": [
      {
        "_id": "user-id",
        "name": "John Doe",
        "email": "john@example.com",
        "totalTasks": 10,
        "completed": 5,
        "inProgress": 3,
        "pending": 2,
        "completionRate": 50
      }
    ]
  }
}
```

### Users (Admin Only)

#### Get All Users
```http
GET /users
Authorization: Bearer <admin-token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <admin-token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <admin-token>
```

### Notes

#### Get Task Notes
```http
GET /notes/task/:taskId
Authorization: Bearer <token>
```

#### Add Note to Task
```http
POST /notes/task/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is a note about the task"
}
```

#### Delete Note
```http
DELETE /notes/:id
Authorization: Bearer <token>
```

Note: Users can only delete their own notes.

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## Error Response Format

```json
{
  "status": "error",
  "message": "Error description here"
}
```

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes per IP
- API endpoints: 100 requests per 15 minutes per IP

## Interactive Documentation

Swagger UI available at: `http://localhost:5000/api-docs`
