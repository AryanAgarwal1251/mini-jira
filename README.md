# Mini Jira

## Overview
A lightweight issue and project management system inspired by Jira, built for academic and small-team use.

## Documentation
- [Vision Document](docs/vision.md)
- [MoSCoW Prioritization](moscow.md)

## Tech Stack
- Frontend: HTML / CSS / JavaScript (or React)
- Backend: Node.js + Express (or Django / Flask)
- Database: MongoDB or PostgreSQL
- Authentication: JWT or session-based authentication

## Branching Strategy (GitHub Flow)

This project follows **GitHub Flow**, a lightweight and industry-recommended branching strategy.

### Branches Used
- `main` – Stable production-ready code
- `feature/authentication` – User login and JWT authentication (example feature branch)

### Workflow
1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/authentication

2. Commit changes regularly with meaningful messages
3. Push the branch to GitHub
   ```bash
   git push origin feature/authentication
4. Open a Pull Request (PR) to merge into main
5. Review → Merge → Delete feature branch
   
## Quick Start – Local Development (Docker)

### Prerequisites
- Docker Desktop
- Git

### Steps
1. Clone the repository
   ```bash
   git clone https://github.com/<your-username>/mini-jira.git
   cd mini-jira
2. Build and start all services
   docker-compose up --build

3. Access the application
   Frontend: http://localhost:3000
   Backend API: http://localhost:5000

stop containers

## Local Development Tools

The following tools were used for local development:

- **Node.js 18** – Backend and frontend runtime
- **Express.js** – Backend framework
- **React.js** – Frontend UI
- **MongoDB** – Database
- **Docker & Docker Compose** – Containerized local development
- **Git & GitHub** – Version control and collaboration
- **VS Code** – Code editor


## Contributors
Aryan Agarwal
