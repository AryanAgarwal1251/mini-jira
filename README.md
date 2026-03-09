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

## Software Design

Mini Jira follows a **layered client–server architecture** designed to ensure modularity, scalability, and maintainability. The system separates the frontend user interface, backend application logic, and database storage into independent layers that communicate through REST APIs.

The **React-based frontend** handles user interaction and communicates with the backend through **JSON-based REST API calls**. The **Node.js + Express backend** processes authentication, project management, and issue management logic. Persistent data such as users, projects, and tasks are stored in a **MongoDB database**.  

The system is **containerized using Docker**, enabling consistent deployment across environments and simplifying infrastructure management.

---

### System Architecture

The architecture diagram below illustrates the overall structure of the Mini Jira system, including the client layer, application layer, database layer, and deployment infrastructure.

![Mini Jira Architecture](https://github.com/AryanAgarwal1251/mini-jira/blob/main/docs/design/Mini-Jira_Arch.png)

**Figure:** High-Level Architecture of the Mini Jira System

The user interacts with the system through a web browser. The frontend interface sends HTTP requests to the backend REST API. The backend processes these requests through different service modules such as authentication, project management, and issue management. Data is stored and retrieved from the MongoDB database through CRUD operations.

---

### Design Principles Applied

The system design follows several core software engineering principles.

**Abstraction**  
The system is divided into layers where each layer hides internal complexity and communicates through defined interfaces such as REST APIs.

**Modularity**  
Backend components are organized into modules such as authentication, project management, and task management, making the system easier to maintain and extend.

**High Cohesion**  
Each module performs a single well-defined responsibility, such as handling authentication or managing tasks.

**Low Coupling**  
Modules interact through APIs instead of direct dependencies, allowing independent development and modification.

---

### User Interface Design

The Mini Jira interface is designed to be simple, consistent, and user-friendly. The UI is developed using **React** and follows modern usability principles.

Key screens include:

- Login Page
- Dashboard
- Create Project Page
- Project Kanban Board
- Task Creation Interface
- Task Detail View

Figma prototype screenshots are available in the design folder.

![Figma Screenshots](https://github.com/AryanAgarwal1251/mini-jira/tree/main/docs/design/figma_screenshots)

---

### Design Artifacts

All design resources are stored in the following directory:

docs/design/
├── architecture.drawio
├── architecture.png
├── erd.drawio
├── erd.png
├── dfd_level1.png
├── context_diagram.png
└── figma_screens/
├── login.png
├── dashboard.png
├── project_board.png
├── create_project.png
├── create_task.png
└── task_detail.png


These artifacts document the structural design and user interface of the Mini Jira system.

---

### Technology Stack

| Layer | Technology |
|------|-------------|
| Frontend | React, HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB |
| Containerization | Docker |
| Infrastructure | Nginx (Reverse Proxy) |

---

### Future Improvements

Possible future enhancements include:

- Real-time notifications
- GitHub issue synchronization
- Team collaboration features
- Analytics dashboard
- Role-based access control improvements

## Contributors
Aryan Agarwal
