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

## Context Diagram

The context diagram shows the Mini Jira system as a single process and illustrates its interaction with external entities such as users and project managers. It highlights how external actors interact with the system through actions such as authentication, project management, and task tracking.

![Context Diagram](https://github.com/AryanAgarwal1251/mini-jira/blob/main/docs/design/context_diagram_mini-jira.png)

---

## Level-1 Data Flow Diagram (DFD)

The Level-1 Data Flow Diagram decomposes the Mini Jira system into major functional processes. These processes include user management, project management, issue management, sprint management, and reporting. The diagram also illustrates how data flows between these processes and the system’s data stores.

![Level 1 DFD](https://github.com/AryanAgarwal1251/mini-jira/blob/main/docs/design/level1_DFDpng.png)

---

## Entity Relationship Diagram (ERD)

The ER diagram represents the database structure of the Mini Jira system. It defines the key entities used by the application and the relationships between them. The main entities include **User, Project, Task, Comment, and ProjectMember**, which together support project collaboration and issue tracking.

![ER Diagram](https://github.com/AryanAgarwal1251/mini-jira/blob/main/docs/design/erd_mini-jira.png)

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
