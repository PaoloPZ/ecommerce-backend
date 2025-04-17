# 🛒 E-commerce Backend

This is a backend API built as part of a technical challenge. It was developed with **Node.js**, **Express**, **MySQL**, and **Docker**, applying clean architecture and API key authentication. The service includes automatic database population for test cases and is ready to run in a containerized environment.

---

## 🚀 Features

- 🧾 Product management (CRUD)
- 🔐 API Key authentication
- 🐳 Docker-based development environment
- 🧪 Auto-populated database with seed data
- 🧰 Sequelize ORM + MySQL
- 🧪 Includes Postman collections for testing

---

## ⚙️ Getting Started

### 1. Run the project with Docker

Make sure Docker is installed and run:

```bash
docker-compose up --build
```

This will:
- Build the application image
- Start the MySQL container
- Populate the database automatically

Wait for the terminal message:

```
Listening on port 8080
```

![Service Up](images/service_1.png)

---

## 🧪 Postman Testing

Postman collections are provided in two formats:
- `postman_collection_v2.json`
- `postman_collection_v2.1.json`

### API Key Authentication

To use the API securely, follow these steps in Postman:

1. Go to the **Authorization** tab  
2. Select **API Key** as Auth Type  
3. Set `Key` to `x-api-key`  
4. Set `Value` using the `ECOMMERCE_API_KEY` from your `.env` file

![Postman Auth](images/postman_1.png)
![API Key Setup](images/postman_2.png)

---

## 🔧 Environment Variables

In your `.env` file:

```env
ECOMMERCE_API_KEY=your_api_key
...
```

---

## 🧬 Database Layer

The app uses **Sequelize ORM** with **MySQL**. All entities and relationships were created and mapped accordingly, including:
- Product entity
- Category entity
- User management (if implemented)
- Sales or orders logic (if applicable)

---

## 👨‍💻 Author

**Paolo Perez Escobar**  
Software Engineer | AI Enthusiast  
[GitHub](https://github.com/PaoloPZ)

---

> ⚠️ This project was originally developed as a challenge and has been improved for public release. It focuses on backend API development, clean code, and Docker integration.



