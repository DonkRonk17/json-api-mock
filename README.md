# 🚀 JSON API Mock Server

A lightweight, zero-dependency mock API server for rapid prototyping and testing. Get a full REST API running in seconds!

## ✨ Features

- **Zero Config**: Works out of the box with default data
- **RESTful**: Full CRUD operations (GET, POST, PUT, DELETE)
- **CORS Enabled**: Perfect for frontend development
- **Persistent**: Data saves to JSON file automatically
- **No Dependencies**: Pure Node.js, no npm packages needed
- **Fast**: Lightweight and blazing fast

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/DonkRonk17/json-api-mock.git
cd json-api-mock

# Start the server
node server.js

# Server running at http://localhost:3000
```

## 📖 Usage

### Start Server
```bash
node server.js              # Default port 3000
node server.js 8080         # Custom port
node server.js 3000 data.json  # Custom data file
```

### API Endpoints

**Get all items**
```bash
GET http://localhost:3000/users
GET http://localhost:3000/posts
GET http://localhost:3000/products
```

**Create new item**
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "New User",
  "email": "user@example.com"
}
```

**Update item**
```bash
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "name": "Updated Name"
}
```

**Delete item**
```bash
DELETE http://localhost:3000/users/1
```

## 📊 Default Collections

- **users**: Sample user data with roles
- **posts**: Blog posts with likes
- **products**: Product catalog with prices

## 🎯 Use Cases

- **Frontend Development**: Test your app without a backend
- **Prototyping**: Quick API for demos and POCs
- **Testing**: Mock API for integration tests
- **Learning**: Practice API calls and CRUD operations

## 🔧 Custom Data

Create a `mock-data.json` file:

```json
{
  "todos": [
    { "id": 1, "task": "Build API", "done": true }
  ],
  "notes": [
    { "id": 1, "title": "Note", "content": "Content here" }
  ]
}
```

Start with custom data:
```bash
node server.js 3000 mock-data.json
```

## 💻 Example Requests

```bash
# Get all users
curl http://localhost:3000/users

# Create a new post
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Hello World"}'

# Update a product
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":899.99}'

# Delete a user
curl -X DELETE http://localhost:3000/users/3
```

## 🌟 Features

- Automatic ID generation for new items
- Data persistence across restarts
- Clean JSON responses
- Request logging
- Error handling

## 📦 No Installation Required

Just Node.js - no npm install needed!

## 🤝 Contributing

Contributions welcome! Feel free to submit PRs.

## 📄 License

MIT License

## 🙏 Credits

Created by **Randell Logan Smith and Team Brain** at [Metaphy LLC](https://metaphysicsandcomputing.com)

Part of the HMSS (Heavenly Morning Star System) ecosystem.

---

**Happy Mocking!** 🎭✨
