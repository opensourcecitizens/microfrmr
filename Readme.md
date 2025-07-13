# Microfrmr

Microfrmr is a full-stack application consisting of a React Native (Expo) frontend and a Node.js/Express backend API (Farmers-Choice-API). The project is now configured to run both services using Docker and GitHub Codespaces for easy development and deployment.

## Project Structure

```
microfrmr/
├── .devcontainer/           # Codespaces configuration
│   └── devcontainer.json
├── Farmers-Choice-API/      # Backend API (Node.js/Express)
├── Screens/                 # Frontend screens (React Native)
├── components/              # Frontend components
├── assets/                  # Static assets
├── appData/                 # App data
├── App.js                   # Frontend entry point
├── docker-compose.yml       # Docker Compose configuration
├── package.json             # Frontend dependencies
└── README.md
```

## Getting Started

### With Docker Compose

1. Build and start both frontend and backend:
   ```
   docker-compose up --build
   ```

2. The API will be available at [http://localhost:3000](http://localhost:3000)  
   The frontend (Expo web) will be available at [http://localhost:19006](http://localhost:19006)

### With GitHub Codespaces

- Open the project in Codespaces.  
- The dev container will automatically set up both services using Docker Compose.

## Features

- **Frontend:** Built with React Native (Expo) for cross-platform support.
- **Backend:** Node.js/Express REST API for managing users, farms, items, reminders, analytics, and marketplace.
- **Dockerized:** Easy local development and deployment with Docker Compose.
- **Codespaces Ready:** Instant cloud development environment.

## License

This project is licensed under