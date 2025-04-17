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

## 🛠️ Docker Considerations

Several adjustments were made to the default template for stability:

- Removed unsupported `command` flag:
  ```yaml
  command:
    - --default-authentication-plugin=mysql_native_password
  ```

- Replaced it with environment configuration:
  ```yaml
  environment:
    - MYSQL_AUTHENTICATION_PLUGIN=mysql_native_password
  ```

- Implemented `wait-for-it.sh` to delay app start until MySQL is ready:
  ```yaml
  command: ["./wait-for-it.sh", "${ECOMMERCE_MYSQL_NAME}:3301", "--", "npm", "run", "dev"]
  ```

Script located at:
```
ecommerce-service/Docker/app/wait-for-it.sh
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

**Paolo Pérez Escobar**  
Backend Developer | AI Enthusiast  
[GitHub](https://github.com/PaoloPZ)

---

> ⚠️ This project was originally developed as a technical challenge and has been improved for public release. It focuses on backend API development, clean code, and Docker integration.



