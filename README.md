# IT Documentation Project - Backend Setup

## Overview

This guide will walk you through setting up the backend for the IT Documentation System. Follow the steps below to get your local development environment up and running.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org) (v16 or higher)
- [Yarn](https://yarnpkg.com) (optional, as an alternative to npm)
- Git

---

## Getting Started

### 1. Clone the Repository

Start by cloning the backend repository to your local machine:

```bash
git clone https://github.com/pakeku/it-doc-system-backend.git
```

### 2. Navigate to the Project Directory

Move into the project folder:

```bash
cd it-doc-system-backend
```

### 3. Install Dependencies

Install the required packages using **npm** or **yarn**. You can choose one of the following commands based on your preference:

```bash
# Using npm
npm install

# Or, using Yarn
yarn
```

### 4. Configure Environment Variables

You'll need to set up your environment variables for development:

- Copy the provided `.env.sample` file to create a new `.env` file.
- Open the `.env` file and update the placeholders with your specific environment variables.

```bash
cp .env.sample .env
```

> **Tip:** Ensure all variables are correctly filled, especially database credentials, API keys, and other secrets.

### 5. Run the Development Server

After configuring the environment variables, you can start the development server using one of the following commands:

```bash
# Using npm
npm run dev

# Or, using Yarn
yarn dev
```

Your backend server should now be running locally!

---

## Troubleshooting

- **Missing dependencies or errors on startup?**
  - Try deleting `node_modules` and reinstalling them:
    ```bash
    rm -rf node_modules
    npm install
    ```

- **Issues with environment variables?**
  - Double-check your `.env` file to ensure all required variables are set.
  
---

## Next Steps

Once your backend is running, you can proceed to testing the API endpoints or setting up the frontend.

For any questions or issues, feel free to check the project's [issue tracker](https://github.com/pakeku/it-doc-system-backend/issues) or contribute to the documentation.