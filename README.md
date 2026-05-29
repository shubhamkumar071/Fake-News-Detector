# TruthLens — Fake News & Manipulation Detector

TruthLens is a premium, full-stack, AI-powered cybersecurity and media intelligence platform designed to scan, audit, and expose misinformation in news articles, social posts, and websites. 

Using machine intelligence, TruthLens computes a **Credibility Index** and identifies grammatical indicators of cognitive hacking: **fear-mongering, ad hominem slurs, clickbait structural loops, and systemic bias**.

---

## Technical Stack
* **Backend Gateway**: Java 17, Spring Boot 3.2.3, Spring Security (Stateless JWT)
* **NLP Intelligence Microservice**: Python 3.9, FastAPI, TextBlob, NLTK, Scikit-Learn
* **Datastore**: MongoDB
* **Auditor Interface**: React.js (Vite), Tailwind CSS, Framer Motion, Recharts

---

## Directory Architecture

```
fake_project/
├── docker-compose.yml              # Single-command environment orchestrator
├── README.md                       # Setup and API documentation
├── nlp-service/                    # Python NLP microservice
│   ├── main.py                     # FastAPI entrypoint
│   ├── model_helper.py             # Linguistic heuristics & analysis pipeline
│   ├── requirements.txt            # Python dependencies
│   └── Dockerfile                  # Python container config
├── backend/                        # Java Spring Boot microservice
│   ├── pom.xml                     # Maven project build file
│   ├── Dockerfile                  # Java multi-stage build setup
│   └── src/main/
│       ├── java/com/truthlens/backend/
│       │   ├── BackendApplication.java # Spring Boot bootstrapper
│       │   ├── config/             # CORS, Security filters, Swagger details
│       │   ├── controller/         # Auth, Admin, History, Analysis routes
│       │   ├── dto/                # Request/Response payloads validation
│       │   ├── exception/          # Global Controller Advisers
│       │   ├── model/              # MongoDB Document Schemas
│       │   ├── repository/         # Database access protocols
│       │   └── service/            # Business validation & REST integrations
│       └── resources/
│           └── application.yml     # Database & port configs
└── frontend/                       # React frontend
    ├── package.json                # NPM dependency manifest
    ├── vite.config.js              # Bundler configs
    ├── tailwind.config.js          # Core themes & colors config
    ├── postcss.config.js           # CSS transformations config
    ├── index.html                  # Main layout HTML frame
    ├── nginx.conf                  # Nginx production routing configuration
    ├── Dockerfile                  # Production-served Nginx builder
    └── src/
        ├── index.css               # Base Tailwind imports & glassmorphic tokens
        ├── main.jsx                # DOM mounting frame
        ├── App.jsx                 # Routing and Navigation mappings
        ├── components/             # Reusable UI widgets (Radar, Dial, Highlights)
        ├── pages/                  # Landing, Login, Profile, Dashboard, Admin panels
        └── utils/                  # Axios middleware with JWT helpers
```

---

## Datastore Schemas (MongoDB)

### 1. `users`
* `id`: ObjectId
* `username`: String (Unique)
* `email`: String (Unique)
* `password`: String (BCrypt-encrypted hash)
* `role`: String (`ROLE_USER` or `ROLE_ADMIN`)
* `createdAt` / `updatedAt`: Date

### 2. `analysisReports`
* `id`: ObjectId
* `userId`: String (Association link)
* `title`: String
* `content`: String
* `url`: String (Nullable)
* `credibilityScore`: Integer (0-100 index)
* `fakeProbability`: Integer (0-100)
* `biasLevel`: String (`Low`, `Medium`, `High`)
* `biasScore`: Integer
* `emotionScore`: Integer
* `toxicityScore`: Integer
* `sentiment`: String (`Positive`, `Negative`, `Neutral`)
* `summary`: String (AI preview snippet)
* `keywords`: List of Strings
* `manipulativePhrases`: List of Object Spans:
  * `phrase`: String (Matched text segment)
  * `type`: String (`Fear-mongering`, `Sensationalism`, etc.)
  * `explanation`: String (Linguistic justification)
  * `startIndex` / `endIndex`: Integer (Coordinates for CSS highlights)
* `sourceVerification`: Object:
  * `domain`: String
  * `status`: String (`TRUSTED`, `UNTRUSTED`, `BIASED`, `UNKNOWN`)
  * `description`: String
* `aiGeneratedProbability`: Integer
* `emotions`: Map:
  * `anger`: Integer, `fear`: Integer, `joy`: Integer, `sadness`: Integer
* `createdAt`: Date

### 3. `newsSources`
* `id`: ObjectId
* `domain`: String (Unique index, e.g. `apnews.com`)
* `name`: String
* `status`: String (`TRUSTED`, `UNTRUSTED`, `BIASED`)
* `category`: String (`Mainstream`, `Satire`, `Conspiracy`, `State-Media`)
* `description`: String
* `addedBy`: String
* `createdAt`: Date

### 4. `adminLogs`
* `id`: ObjectId
* `adminId`: String
* `action`: String (`DELETE_USER`, `ADD_SOURCE`, etc.)
* `details`: String
* `createdAt`: Date

---

## API Endpoints

### 1. Authentication APIs
* `POST /api/auth/register`: Create a new user auditor profile.
* `POST /api/auth/login`: Authenticate credentials, returning user object and JWT bearer token.

### 2. Analysis APIs
* `POST /api/analysis/analyze` (Protected): Forwards article text and optional URL to NLP engine, verifies domain category, and persists audit details under current user.
* `GET /api/analysis/report/{id}` (Protected): Fetches full report data.
* `DELETE /api/analysis/report/{id}` (Protected): Deletes report from history.

### 3. History APIs
* `GET /api/history` (Protected): Fetches current user's past audits sorted by creation date.

### 4. Domain verification APIs
* `GET /api/sources` (Protected): Lists all registered source reputations.
* `GET /api/sources/verify?url={domain}` (Protected): Evaluates safety tags for a specific domain.

### 5. Admin APIs (Protected: `ROLE_ADMIN` only)
* `GET /api/admin/users`: Lists all auditor accounts.
* `DELETE /api/admin/users/{id}`: Deletes user.
* `POST /api/admin/sources`: Registers a new news provider reputation status.
* `PUT /api/admin/sources/{id}`: Modifies registered provider status.
* `DELETE /api/admin/sources/{id}`: Deletes domain reputation record.
* `GET /api/admin/logs`: Lists admin actions histories.
* `GET /api/admin/analytics`: Computes global statistics (Risky audits ratio, average credibility, active accounts ratio).

---

## Setup & Deployment Guide

### Option A: Launch using Docker Compose (Recommended)
This launches MongoDB, the FastAPI service, the Spring Boot app, and the React application in one command:
1. Ensure Docker Desktop is running.
2. In the root directory `fake_project/`, execute:
   ```bash
   docker-compose up --build
   ```
3. Access services:
   * **React UI Portal**: `http://localhost`
   * **Spring Boot REST Gateway**: `http://localhost:8080`
   * **FastAPI Service**: `http://localhost:8000`

---

### Option B: Local Manual Setup (Without Docker)

#### 1. Setup Datastore
Ensure MongoDB is running locally on port `27017` with a database named `truthlens`.

#### 2. Start Python NLP microservice
1. Navigate to `./nlp-service`.
2. Create and source a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start FastAPI server:
   ```bash
   python main.py
   ```
   * Runs on: `http://localhost:8000`

#### 3. Start Spring Boot gateway
1. Navigate to `./backend`.
2. Compile and run:
   ```bash
   ./mvnw spring-boot:run
   ```
   * Runs on: `http://localhost:8080`
   * Swagger Documentation is available at: `http://localhost:8080/swagger-ui/index.html`

#### 4. Start React application
1. Navigate to `./frontend`.
2. Install npm modules:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```
   * Portal available at: `http://localhost:5173`

---

## Environment Configuration

Configure custom variables inside `docker-compose.yml` or your export shell:
* `MONGODB_URI`: Link string for DB connection (Defaults to `mongodb://localhost:27017/truthlens`).
* `NLP_SERVICE_URL`: Port link of Python microservice (Defaults to `http://localhost:8000`).
* `JWT_SECRET`: Signing hash keys for web authorization (Defaults to static 256-bit safe hash).
* `VITE_API_BASE_URL`: React API fetch target endpoint (Defaults to `http://localhost:8080/api`).
