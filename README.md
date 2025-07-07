# Express.js PostgreSQL API

A simple Express.js API that connects to a PostgreSQL database and performs basic CRUD operations on a users table.

## Features

- ✅ Express.js server setup
- ✅ PostgreSQL database connection
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ JSON response format
- ✅ Environment variable configuration

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- PostgreSQL database installed and running
- npm or yarn package manager

## Installation

1. **Clone or download the project files**

2. **Install dependencies**

```bash
npm install
```

3. **Set up PostgreSQL database**

   - Create a new PostgreSQL database
   - Run the SQL script from `database-setup.sql` to create the users table
   - Update the database configuration in your environment variables

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the database credentials:

```bash
cp .env.example .env
```

5. **Update the .env file with your database credentials:**

```
PORT=3000
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

## Running the Application

### Development mode (with auto-restart)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

### Base URL: `http://localhost:3000`

### 1. Get All Users

- **GET** `/users`
- **Response:** Array of all users

### 2. Get User by ID

- **GET** `/users/:id`
- **Response:** Single user object

### 3. Create New User

- **POST** `/users`
- **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25
}
```

### 4. Update User

- **PUT** `/users/:id`
- **Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "age": 30
}
```

### 5. Delete User

- **DELETE** `/users/:id`
- **Response:** Deleted user object

### 6. Health Check

- **GET** `/health`
- **Response:** Server status

## Testing with Postman

### Sample API Calls:

1. **Get all users:**

   - Method: GET
   - URL: `http://localhost:3000/users`

2. **Create a new user:**
   - Method: POST
   - URL: `http://localhost:3000/users`
   - Headers: `Content-Type: application/json`
   - Body:

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28
}
```

3. **Get user by ID:**

   - Method: GET
   - URL: `http://localhost:3000/users/1`

4. **Update user:**
   - Method: PUT
   - URL: `http://localhost:3000/users/1`
   - Headers: `Content-Type: application/json`
   - Body:

```json
{
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "age": 29
}
```

5. **Delete user:**
   - Method: DELETE
   - URL: `http://localhost:3000/users/1`

## Response Format

All API responses follow this format:

### Success Response:

```json
{
  "success": true,
  "data": {
    /* user object or array */
  },
  "message": "Operation completed successfully"
}
```

### Error Response:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid input data
- Database connection errors
- Resource not found (404)
- Duplicate email addresses (409)
- Server errors (500)

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
express-postgres-api/
├── server.js              # Main application file
├── package.json           # Project dependencies
├── .env.example          # Environment variables template
├── .env                  # Environment variables (create this)
├── database-setup.sql    # Database setup script
└── README.md            # Project documentation
```

## Troubleshooting

### Common Issues:

1. **Database connection error:**

   - Check if PostgreSQL is running
   - Verify database credentials in .env file
   - Ensure the database exists

2. **Port already in use:**

   - Change the PORT in .env file
   - Or kill the process using the port

3. **Module not found:**

   - Run `npm install` to install dependencies

4. **Permission denied:**
   - Check PostgreSQL user permissions
   - Ensure the database user has CRUD permissions

## Development

To add new features or modify existing ones:

1. The main server logic is in `server.js`
2. Database queries use parameterized queries to prevent SQL injection
3. All endpoints include proper error handling
4. Add new routes following the existing pattern

## License

This project is licensed under the MIT License.
