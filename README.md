# Proyecto de Promoción para la carrera de TI e ISC

## Overview

This monorepo contains multiple packages related to the ClassTrack application. The main packages are:

- `RaspberryApp`: Placeholder for Raspberry Pi related applications.
- `backend`: Backend API built with KeystoneJS.
- `ClassTrack`: Frontend application built with React Native.

## Repository Structure

### Packages

#### RaspberryApp

This directory is currently a placeholder for future Raspberry Pi related applications.

#### backend

This package contains the backend API for the ClassTrack application. It is built using KeystoneJS.

- **Main Files:**
  - `keystone.ts`: KeystoneJS configuration and setup.
  - `schema.graphql`: GraphQL schema definitions.
  - `schema.prisma`: Prisma schema definitions.

For more details, refer to the [README.md](packages/backend/README.md) in the `backend` directory.

#### ClassTrack

This package contains the frontend application for the ClassTrack platform. It is built using React.

- **Main Files:**
  - `app/`: Contains the main application layout and pages.
  - `assets/`: Contains fonts and images used in the application.
  - `components/`: Contains reusable React components.
  - `constants/`: Contains application-wide constants.
  - `hooks/`: Contains custom React hooks.
  - `scripts/`: Contains utility scripts.
  - `tsconfig.json`: TypeScript configuration file.
  - `babel.config.js`: Babel configuration file.

For more details, refer to the [README.md](packages/ClassTrack/README.md) in the `ClassTrack` directory.

## Getting Started

### Prerequisites

- Node.js
- Yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd 2024-3-ISC09-Deteccion-Automatica-de-Estudiantes-y-Control-de-Asistencia
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

### Running the Applications

#### Backend (backend)

Navigate to the `backend` directory and start the KeystoneJS server:

    ```sh
    cd packages/backend
    yarn start
    ```

#### Frontend (vive-hub-app)

Navigate to the `vive-hub-app` directory and start the React Native App:

    ```sh
    cd packages/vive-hub-api
    yarn start
    ```

For Android:

    ```sh
    yarn android
    ```
For iOS:

    ```sh
    yarn ios
    ```
