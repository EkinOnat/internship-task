# MyCryptoTracker - Full Stack Portfolio Management System

A robust cryptocurrency portfolio tracking application built with .NET 9 and React (Vite). This system allows users to track their crypto assets, visualize profit/loss metrics, and fetch real-time market data through integrated external APIs.

---

## Project Purpose

The MyCryptoTracker is designed to provide users with a centralized dashboard to manage their digital assets. By integrating live price feeds, the application automatically calculates the total value of the portfolio and the performance of individual assets, helping users make informed financial decisions based on real-time data.

## Tech Stack & Decisions

### Backend: .NET 9 Web API

- **Performance:** Leveraged the latest .NET 9 features for high-speed request handling and native OpenAPI support.
- **Database: SQLite:** Chosen for its zero-configuration and portability. It allows the project to be reviewed and run immediately without setting up a separate database server.
- **External API: CoinGecko:** Integrated to provide reliable, real-time pricing data for a wide range of cryptocurrencies.

### Frontend: React (Vite) & Tailwind CSS

- **Vite:** Selected as the build tool for its superior development speed and optimized production bundles.
- **Tailwind CSS:** Used to implement a clean, responsive, and modern "Dark Mode" financial interface.

---

## Design Patterns & Architecture

1.  **Dependency Injection (DI):** Decoupled business logic from controllers using interfaces (e.g., `ICryptoService`). bu approach improves testability and maintainability.
2.  **Service Layer Pattern:** All core logic, including API fetching and portfolio calculations, is encapsulated in a dedicated service layer to keep controllers thin.
3.  **Singleton Pattern (HttpClient):** Managed via `IHttpClientFactory` to prevent socket exhaustion and optimize outbound API connections.
4.  **DTO (Data Transfer Objects):** Used to define strict contracts for data exchange between the backend and frontend, ensuring security and reducing payload sizes.

---

## 🧪 Testing & Quality Assurance

The project includes automated unit tests to ensure the accuracy of financial calculations and portfolio logic:

- **Framework:** xUnit
- **Target:** `PortfolioService` (Profit/Loss calculations)
- **Test Cases:** Price increase scenarios, price drop scenarios, and weighted average calculations.

## Analytical Views

The application includes a specialized Aggregation Layer that provides:

- **Portfolio Summary:** Real-time calculation of Total Portfolio Value, Total Profit/Loss (USD), and Profit/Loss Percentage.
- **Asset Performance Breakdown:** Detailed analysis of each asset's performance relative to its weighted average purchase price.
- **Batch Request Optimization:** Implemented logic to bundle multiple asset price requests, minimizing API calls and preventing rate-limiting (HTTP 429).

---

## Setup & Run Instructions

### 1. Prerequisites

- .NET 9 SDK
- Node.js (v20+)
- Docker Desktop (Optional)

### 2. Running with Docker

Run the following command in the root directory:

docker compose up --build

Frontend: http://localhost:5173

Backend Swagger: http://localhost:5206/swagger

### 3. Manual Installation

#### Backend

```bash
cd MyCryptoTracker
dotnet restore
dotnet run
```

#### Frontend

```bash
cd my-crypto-ui
npm install
npm run dev
```

API Documentation
Once the backend is running, the interactive Swagger/OpenAPI documentation is available at:
http://localhost:5206/swagger/index.html

````

```

```
````
