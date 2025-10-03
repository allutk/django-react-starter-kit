<a id="readme-top"></a>

<br />
<div align="center">
    <h3 align="center">Django + React Starter Kit</h3>
    <p align="center">
        🚀 Production-ready boilerplate for building modern web applications with <b>Django</b> (backend) and <b>React</b> (frontend).
    </p>
    <p align="center">
        This project includes authentication, API setup, and Docker-based development environment — perfect for kickstarting new projects or learning fullstack development.
    </p>
</div>


<details>
    <summary>Table of Contents</summary>
        <ol>
            <li><a href="#tech-stack">Tech Stack</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#project-structure">Project Structure</a></li>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#development-build">Development Build</a></li>
            <li><a href="#credentials">Credentials</a></li>
            <li><a href="#screenshots">Screenshots</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
            <li><a href="#todo-list">ToDo list</a></li>
        </ol>
</details>


## Tech Stack

[![Python][Python.org]][Python-url]<br />
[![Django][Django]][Django-url]<br />
[![DRF][DRF]][DRF-url]<br />
[![React][React]][React-url]<br />
[![React-Router][React-Router]][React-Router-url]<br />
[![Postgres][Postgres]][Postgres-url]<br />
[![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Features
- **Backend:** Django + Django REST Framework (API)
- **Frontend:** React + React Router
- **Auth:** JWT authentication (register/login/logout)
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions (linting & tests)
- **Extras:** Pre-configured ESLint, Black, and Prettier

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Project Structure
```
django-react-starter-kit/
├── backend/ # Django + DRF project
├── frontend/ # React app with Router
├── docker/ # Dockerfiles and configs
├── docker-compose.yml
└── .dockerignore
└── .gitignore
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Getting Started

1. Clone the repo:
    ```bash
    git clone https://github.com/allutk/django-react-starter-kit.git
    cd django-react-starter-kit
    ```

2. Start services with Docker:
    ```bash
    docker compose up --force-recreate --build -d
    ```

3. Open apps:
    - Backend API → http://localhost:8000/api/
    - Frontend → http://localhost:3000/

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Development Build

1. Start the frontend:
    ```bash
    npm run --prefix frontend/ dev
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Credentials

- User: `demo@example.com`
- Password: `demo123`

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Screenshots

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Roadmap

- [ ] Initial repo configuration

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## ToDo list

ToDo list is currently empty

<p align="right">(<a href="#readme-top">back to top</a>)</p>


[Python.org]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://www.python.org
[Django]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green
[Django-url]: https://www.djangoproject.com
[DRF]: https://img.shields.io/badge/django%20rest%20framework-092E20?style=for-the-badge&logo=django&logoColor=green
[DRF-url]: https://www.django-rest-framework.org
[React]: https://img.shields.io/badge/react-black?style=for-the-badge&logo=react
[React-url]: https://react.dev
[React-Router]: https://img.shields.io/badge/react%20router-black?style=for-the-badge&logo=react
[React-Router-url]: https://reactrouter.com
[Postgres]: https://img.shields.io/badge/postgresql-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Postgres-url]: https://www.postgresql.org
[Docker]: https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com
