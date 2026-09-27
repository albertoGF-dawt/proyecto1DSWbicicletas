# Bicycle & Brand Management REST API 🚲

A RESTful API built with **Node.js** and **Express** for managing bicycle inventory and bicycle brands. Developed as part of the *Server-Side Web Development (DSW)* course.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation & Endpoints](#api-documentation--endpoints)
  - [Bicycles Endpoint](#1-bicycles-endpoint)
  - [Brands Endpoint](#2-brands-endpoint)
- [Testing with Postman](#testing-with-postman)
- [Author](#author)
- [License](#license)

---

## 🎯 About the Project

This project provides a backend REST API service designed to handle data operations for bicycles and their associated brands/manufacturers. It exposes structured endpoints for standard CRUD (Create, Read, Update, Delete) operations and returns JSON responses.

---

## 🛠️ Tech Stack

* **Runtime Environment:** [Node.js](https://nodejs.org/)
* **Web Framework:** [Express.js](https://expressjs.com/)
* **Data Format:** JSON
* **API Testing Tool:** [Postman](https://www.postman.com/)

---

## ✨ Features

- Full CRUD operations for bicycle models.
- Full CRUD operations for bicycle brands.
- RESTful URL structure and standard HTTP response status codes.
- Modular route and controller architecture.

---

## 📁 Project Structure

```text
proyecto1DSWbicicletas/
├── src/
│   ├── config/          # Database connection & configurations
│   ├── controllers/     # Business logic & request handling
│   ├── models/          # Data schemas and models
│   ├── routes/          # API route definitions
│   │   ├── bicycles.js  # Bicycle routes
│   │   └── brands.js    # Brand routes
│   └── app.js           # Express application setup & server entry
├── .env.example         # Environment variables template
├── package.json         # NPM dependencies and scripts
└── README.md            # Project documentation
```

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
* [npm](https://www.npmjs.com/) (Node Package Manager)
* [Postman](https://www.postman.com/downloads/) or any API testing client

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/albertoGF-dawt/proyecto1DSWbicicletas.git
   cd proyecto1DSWbicicletas
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example` if available):

```env
PORT=3000
NODE_ENV=development
```

### Running the Application

* **Start the server (Production):**
  ```bash
  npm start
  ```

* **Start the server with live reload (Development):**
  ```bash
  npm run dev
  ```

By default, the server runs at `http://localhost:3000`.

---

## 🔌 API Documentation & Endpoints

### 1. Bicycles Endpoint

* **Base URL:** `http://localhost:3000/api/bicycles`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `http://localhost:3000/api/bicycles` | Get all bicycles |
| `GET` | `http://localhost:3000/api/bicycles/:id` | Get a bicycle by ID |
| `POST` | `http://localhost:3000/api/bicycles` | Create a new bicycle entry |
| `PUT` | `http://localhost:3000/api/bicycles/:id` | Update a bicycle entry by ID |
| `DELETE` | `http://localhost:3000/api/bicycles/:id` | Delete a bicycle entry by ID |

#### Example Request Body (`POST /api/bicycles`):
```json
{
  "model": "Pro Trail 29",
  "brand": "Trek",
  "price": 1200.00,
  "category": "Mountain"
}
```

---

### 2. Brands Endpoint

* **Base URL:** `http://localhost:3000/api/brands`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `http://localhost:3000/api/brands` | Get all bicycle brands |
| `GET` | `http://localhost:3000/api/brands/:id` | Get a brand by ID |
| `POST` | `http://localhost:3000/api/brands` | Add a new brand |
| `PUT` | `http://localhost:3000/api/brands/:id` | Update brand details by ID |
| `DELETE` | `http://localhost:3000/api/brands/:id` | Delete a brand by ID |

#### Example Request Body (`POST /api/brands`):
```json
{
  "name": "Specialized",
  "country": "USA",
  "foundedYear": 1974
}
```

---

## 📮 Testing with Postman

To test the API endpoints using **Postman**:

1. Start your local server (`http://localhost:3000`).
2. Open Postman and create a new request.
3. Test the primary endpoints:
   - **Bicycles Collection:** `http://localhost:3000/api/bicycles`
   - **Brands Collection:** `http://localhost:3000/api/brands`
4. Set the HTTP request header:
   ```text
   Content-Type: application/json
   ```
5. Include JSON payloads in the **Body** tab (`raw` > `JSON`) for `POST` and `PUT` requests.

---

## 👤 Author

* **Alberto GF** - [*albertoGF-dawt*](https://github.com/albertoGF-dawt)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
