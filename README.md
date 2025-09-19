# FleetLink - Logistics Management Platform

FleetLink is a modern, full-stack logistics management platform designed to streamline vehicle booking and management. It provides a user-friendly interface for searching, booking, and managing vehicles, as well as a robust backend for handling the business logic.

---

## ✨ Features

- **Vehicle Search:** Search for available vehicles based on capacity, pincode, and start time.
- **Booking:** Book vehicles for a specific time slot.
- **Vehicle Management:** Add, view, and manage vehicles in the fleet.
- **Booking Management:** View and cancel bookings.
- **Dockerized:** The entire application is containerized using Docker for easy setup and deployment.
- **Tested:** The backend API is fully tested using Jest and Supertest.

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB

### Local Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/AKASH-PRASAD7/FleetLink.git
    cd fleetlink
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following:

    ```
    MONGODB_URI=mongodb://localhost:27017/fleetlink
    PORT=8000
    ```

4.  **Start the development servers:**

    ```bash
    # Start the backend server
    npm run dev:server

    # Start the frontend server
    npm run dev:client
    ```

    The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

---

## 🐳 Docker Setup

1.  **Build and start the containers:**

    ```bash
    docker-compose up
    ```

2.  **Access the application:**

    The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

---

##  API Endpoints

### Vehicles

- `POST /api/v1/vehicles`: Create a new vehicle.
- `GET /api/v1/vehicles/available`: Get available vehicles based on search criteria.
- `GET /api/v1/vehicles`: Get all vehicles.

### Bookings

- `POST /api/v1/bookings`: Create a new booking.
- `GET /api/v1/bookings`: Get all bookings.
- `DELETE /api/v1/bookings/:id`: Delete a booking by its ID.

---

## 🧪 Running Tests

To run the tests for the backend API, use the following command:

```bash
npm test
```
