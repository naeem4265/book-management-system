# Book Management System API

A RESTful API for managing books and authors built with NestJS, TypeScript, PostgreSQL, and TypeORM.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Migrations](#database-migrations)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v22.17.0) - [Download](https://nodejs.org/)
- **npm** (v10.9.2) - Comes with Node.js
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.development` file**

   Create a `.env.development` file in the root directory with the following content:

   ```env
   # Server Configuration
   NODE_ENV=development
   APP_PORT=3000
   APP_HOST=localhost

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=book_management
   ```

## Database Migrations

The project uses TypeORM migrations to manage database schema. Run migrations to set up the database tables:

```bash
# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Generate a new migration (after entity changes)
npm run migration:generate --name=YourMigrationName
```


## Running the Project

### Development Mode

```bash
# Start the development server with hot-reload
npm run start:dev
```

The server will start on `http://localhost:3000` (or the port specified in `APP_PORT`).

### Production Mode

```bash
# Build the project
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode

```bash
# Start with debugging enabled
npm run start:debug
```

### Check Server Status

Once the server is running, you should see:

```
Application is running on: http://localhost:3000
```

## API Documentation

Once the server is running, access the Swagger API documentation at:

**http://localhost:3000/swagger**

The Swagger UI provides:
- Interactive API documentation
- Try-it-out functionality for all endpoints
- Request/response schemas
- Authentication details (when implemented)

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### End-to-End Tests

Before running e2e tests, ensure you have a test database configured:

```bash
# Create test database
createdb book_management_test

# Update .env.test or set environment variables
export DB_NAME=book_management_test

# Run e2e tests
npm run test:e2e
```

## Project Structure

```
book-management-system/
├── config/                 # Configuration files
│   ├── database.config.ts  # TypeORM database configuration
│   ├── env.schema.ts      # Environment variables validation
│   └── migration.config.ts # Migration configuration
├── migrations/            # Database migration files
│   ├── 1762593004049-author-v1.ts
│   └── 1762602106379-books-v1.ts
├── src/
│   ├── common/            # Shared utilities
│   │   ├── dto/          # Common DTOs
│   │   └── types/        # Type definitions
│   ├── modules/
│   │   ├── author/       # Author module
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   └── book/         # Book module
│   │       ├── controllers/
│   │       ├── dtos/
│   │       ├── entities/
│   │       ├── repositories/
│   │       └── services/
│   ├── app.module.ts     # Root module
│   └── main.ts           # Application entry point
├── test/                 # E2E tests
├── .env.development      # Development environment variables
├── package.json
└── README.md
```

## API Endpoints

### Authors

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/authors` | Create a new author |
| `GET` | `/authors` | Get all authors (with pagination & search) |
| `GET` | `/authors/:id` | Get author by ID |
| `PATCH` | `/authors/:id` | Update author by ID |
| `DELETE` | `/authors/:id` | Delete author by ID |

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/books` | Create a new book |
| `GET` | `/books` | Get all books (with pagination, search & filter) |
| `GET` | `/books/:id` | Get book by ID |
| `PATCH` | `/books/:id` | Update book by ID |
| `DELETE` | `/books/:id` | Delete book by ID |

### Query Parameters

**GET /authors** and **GET /books** support:
- `page` - Page number (default: 1)
- `limit` - Items per page
- `search` - Search term (partial match, case-insensitive)
  - Authors: searches in `firstName` and `lastName`
  - Books: searches in `title` and `isbn`
- `authorId` - Filter books by author ID (Books only)

### Example Requests

**Create Author:**
```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "bio": "A famous author",
    "birthDate": "1980-01-01"
  }'
```

**Create Book:**
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Novel",
    "isbn": "978-3-16-148410-0",
    "publishedDate": "2024-01-01",
    "genre": "Fantasy",
    "authorId": "author-uuid-here"
  }'
```

**Get Books with Pagination:**
```bash
curl "http://localhost:3000/books?page=1&limit=10&search=novel&authorId=author-uuid-here"
```

## Error Handling

The API returns consistent error responses:

```json
{
  "statusCode": 404,
  "message": "Author with id 123 not found",
  "error": "Not Found"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (for DELETE)
- `400` - Bad Request (validation errors, invalid UUID)
- `404` - Not Found
- `409` - Conflict (duplicate ISBN)

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Test database connection
psql -U postgres -d book_management -h localhost

# Check if database exists
psql -U postgres -l
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change APP_PORT in .env.development
```

### Migration Issues

```bash
# Check migration status
psql -U postgres -d book_management -c "SELECT * FROM migrations;"

# If migrations are stuck, you may need to manually fix the migrations table
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
