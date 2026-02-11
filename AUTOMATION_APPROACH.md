# Part 2: Automation Approach - DevOps Project

## Executive Summary
This document describes the comprehensive DevOps automation approach for the MERN Stack Book Store Application, including CI/CD orchestration, containerization, infrastructure provisioning, and deployment automation across development, staging, and production environments.

---

## 1. DevOps Tools & Technologies

### 1.1 CI/CD Orchestration

| Tool | Version | Purpose |
|------|---------|---------|
| **Jenkins** | Latest | Primary CI/CD orchestration server that automates the entire pipeline from code commit to Docker image deployment |
| **Git/GitHub** | Latest | Source control management with branch-based workflow (main, develop, feature branches) for version control |
| **Docker** | Latest | Containerization platform for building, packaging, and running application images |
| **Docker Hub** | Latest | Docker Registry for storing and managing container images (Registry: `lahiru2002/frontend-app`, `lahiru2002/backend-app`) |
| **Docker Compose** | 3.8 | Multi-container orchestration tool for local development and service coordination |

### 1.2 Infrastructure & Deployment

| Tool | Version | Purpose |
|------|---------|---------|
| **Terraform** | Latest | Infrastructure as Code (IaC) for provisioning and managing cloud resources in a declarative manner |
| **Kubernetes** | Latest | Container orchestration platform for managing containerized applications at scale (mentioned in CICD_DIAGRAM_EXPLANATION.md) |

### 1.3 Code Quality & Security

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.30.1 | Static code analysis for JavaScript/React frontend code quality and style enforcement |
| **SonarQube** | Latest | Comprehensive code quality platform for detecting bugs, vulnerabilities, and code smells across the codebase |
| **Trivy** | Latest | Security vulnerability scanner for Docker images to identify CVEs and security issues before deployment |

### 1.4 Build & Package Management

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20-alpine | JavaScript runtime for backend and frontend build/runtime environments |
| **npm** | Latest (bundled with Node 20) | Package manager for dependency management and script execution |

---

## 2. Application Tools & Dependencies

### 2.1 Backend Stack

**Framework & Runtime:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.1.0 | Lightweight web framework for building REST API endpoints |
| **Node.js** | 20-alpine | JavaScript runtime environment |
| **npm** | Latest | Package and dependency manager |

**Database & Authentication:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | Latest (mongo:latest) | NoSQL database for storing books, users, and orders data |
| **Mongoose** | 8.17.2 | ODM (Object Data Modeling) library for MongoDB schema definition and validation |
| **JWT (jsonwebtoken)** | 9.0.2 | JSON Web Token library for secure user authentication and authorization |
| **bcrypt** | 6.0.0 | Password hashing library for secure user credential storage |

**Utilities:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **CORS** | 2.8.5 | Middleware for handling Cross-Origin Resource Sharing between frontend and backend |
| **dotenv** | 17.2.1 | Environment variable management for secure configuration without hardcoding secrets |
| **nodemon** | 3.1.10 | Development tool for auto-restarting Node.js server on code changes |

### 2.2 Frontend Stack

**Framework & Build Tools:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | JavaScript library for building user interfaces with component-based architecture |
| **React DOM** | 19.1.0 | React package for DOM rendering |
| **Vite** | 7.0.4 | Modern build tool and development server with lightning-fast HMR (Hot Module Replacement) |
| **React Router DOM** | 7.7.1 | Client-side routing library for navigation between pages |
| **Node.js** | 20-alpine | JavaScript runtime for building and serving frontend |

**State Management & Forms:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Redux Toolkit** | 2.8.2 | Simplified state management library for managing global application state |
| **React Redux** | 9.2.0 | Official React bindings for Redux state management |
| **React Hook Form** | 7.62.0 | Lightweight form library for handling form validation and submissions |

**API & Data Fetching:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.11.0 | Promise-based HTTP client for making API requests to the backend |

**UI & Styling:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.3.2 | Utility-first CSS framework for rapid UI development |
| **PostCSS** | 8.5.6 | CSS transformation tool required by Tailwind CSS |
| **Autoprefixer** | 10.4.21 | PostCSS plugin for adding vendor prefixes to CSS properties |
| **React Icons** | 5.5.0 | Icon library providing popular icon sets as React components |
| **Swiper** | 11.2.10 | Touch slider library for creating carousels and slideshows |
| **SweetAlert2** | 11.22.4 | Beautiful replacement for JavaScript alert dialogs |

**Backend Integration:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Firebase** | 12.1.0 | Backend-as-a-Service for authentication, real-time database, and storage (used for admin login) |

**Development Tools:**

| Dependency | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.30.1 | JavaScript linter for code quality and style checking |
| **@vitejs/plugin-react** | 4.6.0 | Vite plugin for React support with Fast Refresh |

---

## 3. Automated Deployment Pipeline

### 3.1 Pipeline Architecture Overview

The application deployment is fully automated using a **Jenkins-based CI/CD Pipeline** that integrates with GitHub for source control and Docker Hub for container registry management.

### 3.2 Pipeline Stages & Workflow

```
Developer Push → GitHub Webhook → Jenkins Pipeline → Build → Test → 
Container Build → Push to Registry → Deploy
```

#### **Stage 1: Repository Cloning**
- **Trigger:** Webhook triggered on code push to GitHub repository
- **Action:** Jenkins clones the latest code from the specified Git branch (main/develop/feature branches)
- **Script:**
  ```groovy
  git branch: 'main', url: "${GIT_REPO}"
  ```
- **Purpose:** Ensures the pipeline works with the latest source code

---

#### **Stage 2: Code Quality Analysis** (Integrated)
- **Tool:** ESLint + SonarQube
- **Frontend:**
  - ESLint (v9.30.1) scans JavaScript/React files for code style violations
  - Runs: `npm run lint`
- **Backend:**
  - Static code analysis for Node.js/Express code
- **Artifacts:** Quality reports generated for metrics and trend analysis
- **Purpose:** Identify code issues, security vulnerabilities, and maintainability concerns early

---

#### **Stage 3: Build & Unit Testing**
- **Frontend Build:**
  - Install dependencies: `npm install`
  - Build production artifacts: `npm run build` (Vite)
  - Output: Optimized dist/ directory with minified assets
  
- **Backend Build:**
  - Install dependencies: `npm install`
  - Run unit tests: `npm test`
  - Verify API routes and business logic functionality
  
- **Purpose:** Ensure code compiles without errors and unit tests pass

---

#### **Stage 4: Containerization (Docker Build)**

**Frontend Docker Image:**
```dockerfile
FROM node:20-alpine as builder
# Multi-stage build: Compiles React/Vite application
# Final stage: Node:20-alpine + Nginx
# Size: Optimized for production (minimal base image)
```
- **Image Name:** `lahiru2002/frontend-app:latest`
- **Process:**
  - Build React application using Vite
  - Copy built assets to Nginx container
  - Configure Nginx for static file serving and routing
  
**Backend Docker Image:**
```dockerfile
FROM node:20-alpine
# Single-stage build: Lightweight production image
# Dependencies: express, mongoose, jwt, bcrypt, cors, dotenv
```
- **Image Name:** `lahiru2002/backend-app:latest`
- **Process:**
  - Install Node.js dependencies (production only)
  - Copy application source code
  - Configure health check endpoint: `/api/books`
  - Set environment variables for production

**Security Scanning:**
- **Tool:** Trivy (vulnerability scanner)
- **Action:** Scans generated Docker images for CVEs and security vulnerabilities
- **Purpose:** Prevent deployment of images with critical security issues

---

#### **Stage 5: Push to Container Registry**

**Docker Hub Authentication:**
```groovy
withCredentials([usernamePassword(
    credentialsId: 'dockerhub',
    usernameVariable: 'DOCKER_USER',
    passwordVariable: 'DOCKER_PASS'
)]) {
    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
}
```

**Image Push:**
- Push Frontend: `lahiru2002/frontend-app:latest`
- Push Backend: `lahiru2002/backend-app:latest`
- **Registry:** Docker Hub (public repository)
- **Purpose:** Make container images available for deployment across environments

**Cleanup:**
- Logout from Docker Hub after successful push
- Clear credentials from Jenkins memory

---

#### **Stage 6: Infrastructure Provisioning (Terraform)**
- **Purpose:** Automatically provision cloud infrastructure (compute, networking, storage, databases)
- **Workflow:**
  1. **Validate:** Terraform syntax validation
  2. **Plan:** Generate execution plan for infrastructure changes
  3. **Apply:** Deploy infrastructure resources
  4. **Destroy:** Clean up resources when needed (optional)
- **Benefits:** 
  - Idempotent deployments (safe to run multiple times)
  - Version-controlled infrastructure
  - Consistent environment setup

---

#### **Stage 7: Deployment to Environments**

**Development Environment:**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```
- Hot-reload enabled for both frontend and backend
- Volumes mapped for live code editing
- MongoDB runs locally with sample data

**Staging Environment:**
- Uses standard docker-compose.yml
- Full multi-container orchestration
- Environment variables configured via .env file

**Production Environment:**
- Kubernetes deployment (mentioned in CICD diagram)
- Container orchestration with Helm charts
- Load balancing and auto-scaling
- Health checks and rolling updates

---

### 3.3 Complete Pipeline Configuration

**Jenkins Pipeline File:** [pipeline.groovy](pipeline.groovy)

**Key Environment Variables:**
```groovy
FRONTEND_IMAGE = "lahiru2002/frontend-app"
BACKEND_IMAGE = "lahiru2002/backend-app"
GIT_REPO = "https://github.com/Lahiru-code/devops-project.git"
```

**Post-Pipeline Actions:**
- Docker logout (credential cleanup)
- Slack/Email notifications (optional)
- Artifact archiving
- Build status updates to GitHub

---

## 4. Service Dependencies & Networking

### Docker Compose Service Architecture

```yaml
Services:
├── MongoDB (Database)
│   ├── Image: mongo:latest
│   ├── Port: 27017
│   └── Storage: Named volume (mongodb_data)
├── Backend (API Server)
│   ├── Image: lahiru2002/backend-app
│   ├── Port: 5000
│   ├── Dependencies: MongoDB
│   └── Health Check: GET /api/books
└── Frontend (Web Server)
    ├── Image: lahiru2002/frontend-app
    ├── Port: 80 (Nginx)
    ├── Dependencies: Backend
    └── Environment: VITE_API_URL=http://backend:5000
```

### Network Configuration
- **Driver:** Bridge network (bookstore-network)
- **Service Discovery:** Docker DNS resolves service names
- **Communication:** Backend ↔ MongoDB, Frontend ↔ Backend via service names

---

## 5. Environment Configuration

### Environment Variables Management

**Backend (.env):**
```
NODE_ENV=production
PORT=5000
DB_URL=mongodb://user:password@mongodb:27017/bookstore
JWT_SECRET=<secure-secret-key>
MONGO_USER=<database-username>
MONGO_PASSWORD=<database-password>
```

**Frontend (.env):**
```
NODE_ENV=production
VITE_API_URL=http://backend:5000
```

**Benefits:**
- Secrets not hardcoded in source
- Environment-specific configuration
- Easy credential rotation
- Support for 12-factor app principles

---

## 6. Automation Benefits

| Benefit | Impact |
|---------|--------|
| **Continuous Integration** | Code changes automatically tested and integrated |
| **Continuous Deployment** | Automated deployment to multiple environments |
| **Reduced Manual Effort** | 90%+ automation of repetitive tasks |
| **Faster Release Cycles** | From code commit to production in minutes |
| **Quality Assurance** | Automated testing and code scanning at every stage |
| **Security** | Vulnerability scanning and credential management |
| **Consistency** | Identical deployments across environments (IaC) |
| **Rollback Capability** | Previous versions available for quick rollback |
| **Audit Trail** | Complete history of all deployments and changes |

---

## 7. Development Workflow

### Local Development

**Prerequisites:**
- Docker and Docker Compose installed
- Git configured with GitHub credentials
- Node.js 20+ for IDE support

**Development Setup:**
```bash
# 1. Clone repository
git clone https://github.com/Lahiru-code/devops-project.git
cd devops-project

# 2. Configure environment
cp .env.example .env
# Edit .env with local credentials

# 3. Start development environment with hot-reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

**Development Ports:**
- Frontend: http://localhost:5173 (Vite dev server with HMR)
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Feature Development & Testing

1. **Create feature branch:**
   ```bash
   git checkout -b feature/book-search
   ```

2. **Develop and test locally** with hot-reload

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: add book search functionality"
   git push origin feature/book-search
   ```

4. **Create Pull Request** → Triggers automated pipeline testing

5. **Merge to develop** → Staging deployment

6. **Merge to main** → Production deployment

---

## 8. Monitoring & Maintenance

### Health Checks

**Backend:**
- Endpoint: `GET /api/books`
- Interval: 30 seconds
- Timeout: 3 seconds
- Failure Action: Container restart

**MongoDB:**
- Default MongoDB health check enabled
- Data persistence via named volume

### Logging & Debugging

```bash
# View service logs
docker compose logs [service_name]

# Follow logs in real-time
docker compose logs -f [service_name]

# View logs from specific timestamp
docker compose logs --since 10m
```

### Database Persistence

```bash
# MongoDB data persisted in named volume: mongodb_data
# To reset database:
docker compose down -v
```

---

## 9. Security Practices

1. **Credential Management:**
   - Jenkins credentials for Docker Hub
   - Environment variables for sensitive data
   - No hardcoded secrets in source code

2. **Image Security:**
   - Trivy vulnerability scanning
   - Alpine Linux base images (minimal attack surface)
   - Regular dependency updates

3. **Network Security:**
   - Internal Docker bridge network
   - Service-to-service communication via DNS
   - Firewall rules for external access

4. **Authentication:**
   - JWT tokens for API authentication
   - bcrypt password hashing
   - Firebase authentication for admins

---

## 10. Scaling & Performance Optimization

### Container Optimization

- **Multi-stage Docker builds:** Reduced image size
- **Alpine Linux:** Lightweight base image (5MB vs 900MB)
- **npm ci:** Deterministic dependency installation
- **Health checks:** Automatic container recovery

### Frontend Performance

- **Vite build optimization:** Code splitting and minification
- **Nginx:** Efficient static file serving
- **Asset compression:** Gzip and brotli compression

### Backend Scalability

- **Stateless design:** Enables horizontal scaling
- **Connection pooling:** Efficient MongoDB connections
- **Load balancing:** Ready for Kubernetes deployment

---

## Summary

This comprehensive DevOps automation approach ensures:
- ✅ **Automated testing** at every stage
- ✅ **Rapid deployments** from code commit to production
- ✅ **Security scanning** for vulnerabilities
- ✅ **Infrastructure consistency** via IaC
- ✅ **Easy environment management** across dev/staging/prod
- ✅ **Scalability** for enterprise-grade deployments
- ✅ **Reliability** with health checks and auto-recovery

The pipeline integrates industry-standard tools (Jenkins, Docker, Terraform) to deliver a production-ready, fully automated application deployment system.
