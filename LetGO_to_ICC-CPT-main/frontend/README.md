# Frontend Project

## Overview
This project is a role-based trip booking dashboard frontend built with React and Material UI. It supports three user roles: Member, Driver, and Admin, each with dedicated views and functionalities. The app uses modern React features and libraries such as React Router, Zustand for state management, React Hook Form, and Socket.io for real-time communication.

## Features
- Role-based UI for Members, Drivers, and Admins
- Live trip tracking and status updates
- Driver and booking management for Admins
- Responsive design with Material UI
- Real-time notifications using socket.io
- Form handling with React Hook Form and validation with Zod
- Localization support with react-i18next

## Tech Stack
- React 19
- Material UI (MUI) 7
- Vite for fast build and dev server
- Zustand for state management
- React Hook Form + Zod for forms and validation
- Socket.io client for real-time features
- React Router DOM for routing
- Lucide-react & MUI Icons for icons
- Emotion for styling

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- Yarn or npm package manager

### Installation

Clone the repo
git clone <your-repository-url>
cd frontend

Install dependencies
npm install

or
yarn install

Start the development server

npm run dev

or
yarn dev


## Project Structure
- `/src/components`: React components split by role and shared components
- `/src/theme`: Material UI theme configuration
- `/src/hooks`: Custom hooks (if any)
- `/src/pages/`: For any pages
- `/src/assets`: Static assets like images, icons, etc.
- `/src/utils`: Utility functions and helpers
- `/src/routes`: React Router route components

## Scripts

| Script       | Description                         |
| ------------ | --------------------------------- |
| `npm run dev`| Starts the app in development mode |
| `npm run build` | Builds the app for production    |
| `npm run preview` | Preview the production build   |
| `npm run lint` | Run ESLint to analyze code style |

## Contributing
Contributions are welcome! Please open issues or submit pull requests for bug fixes and feature requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy coding!


