# Kutum Login System

A comprehensive web application to help families organize and manage important information including family members, documents, vehicles, and health records.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6)
![Bun](https://img.shields.io/badge/Bun-Latest-f9f1e1)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [User Roles](#-user-roles)
- [Key Features](#-key-features)
- [Development Guidelines](#-development-guidelines)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Admins
- 📊 **System Dashboard** - Overview of all system configurations
- 🩸 **Blood Groups Management** - Configure blood group types
- 📄 **Document Types** - Manage document categories
- 👥 **Relation Types** - Define family relationship types
- 👔 **Clothing Sizes** - Configure size options

### For Users
- 👨‍👩‍👧‍👦 **Family Members** - Manage family profiles with detailed information
- 📁 **Documents** - Upload, organize, and share important documents
- 🚗 **Vehicles** - Track vehicle information with expiry alerts
- 🏥 **Health Records** - Maintain family health information
- 🔔 **Reminders** - Track important dates and renewals
- 📱 **Mobile Responsive** - Works seamlessly on all devices

---

## 🛠️ Tech Stack

### Core
- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime & package manager
- **[Vite 6.0.5](https://vitejs.dev/)** - Next generation frontend tooling
- **[React 18.3.1](https://react.dev/)** - UI library
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Type safety

### Routing & State
- **[React Router DOM 7.1.1](https://reactrouter.com/)** - Client-side routing
- **React Context API** - Global state management
- **LocalStorage** - Data persistence (temporary)

### Styling
- **[Tailwind CSS 3.4.17](https://tailwindcss.com/)** - Utility-first CSS
- **Custom Design System** - Brand colors & components
- **Responsive Design** - Mobile-first approach

### UI Components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications
- **[React Hook Form](https://react-hook-form.com/)** - Form management

### Internationalization (Ready)
- **[i18next](https://www.i18next.com/)** - Translation framework
- **[react-i18next](https://react.i18next.com/)** - React bindings
- Support for: English, Hebrew (RTL ready)

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh/)** installed on your system
  ```bash
  # Install Bun (macOS, Linux, WSL)
  curl -fsSL https://bun.sh/install | bash
  
  # Or for Windows
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kutum
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create environment file**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   # Then edit .env with your values
   ```

4. **Start development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Demo Credentials

**Admin Access:**
- Email: `admin@kutum.com`
- Password: `admin123`

**Regular User:**
- Register a new account at `/register`

---

## 📁 Project Structure

```
kutum/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, logos
│   ├── components/           # React components
│   │   ├── auth/            # ProtectedRoute
│   │   ├── common/          # Pagination
│   │   ├── layout/          # TopNav
│   │   └── ui/              # Future: UI components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/               # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── admin/          # Admin pages
│   │   ├── user/           # User pages
│   │   └── DashboardEntry.tsx
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilities
│   │   ├── constants/      # Constants
│   │   ├── helpers/        # Helper functions
│   │   └── functions/      # Debounce, throttle
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env                     # Environment variables
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── package.json             # Dependencies
```

---

## 📜 Available Scripts

```bash
# Development
bun run dev              # Start dev server at http://localhost:3000

# Build
bun run build            # TypeScript compile + production build

# Preview
bun run preview          # Preview production build locally

# Linting
bun run lint             # Run ESLint to check code quality

# Package Management
bun add <package>        # Add a new dependency
bun add -d <package>     # Add a dev dependency
bun remove <package>     # Remove a dependency
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Application
VITE_APP_TITLE=Kutum - Family Management

# API Configuration (Future)
VITE_API_URL=http://localhost:3001/api

# Pagination
VITE_PAGE_SIZE=10
```

See `.env.example` for reference.

---

## 👥 User Roles

### Admin
- Full system access
- Configure system-wide settings
- Manage reference data (blood groups, document types, etc.)
- Access admin dashboard

### User
- Manage family data
- Upload and organize documents
- Track vehicles and health records
- Set reminders

---

## 🎯 Key Features

### 📊 Data Management
- **CRUD Operations** - Create, Read, Update, Delete
- **Pagination** - Efficient data display
- **Search & Filter** - Quick data access
- **Data Persistence** - LocalStorage (temporary)

### 🔒 Security
- **Authentication** - Login/Register system
- **Authorization** - Role-based access control
- **Protected Routes** - Secure page access
- **Session Management** - LocalStorage-based

### 📱 Responsive Design
- **Mobile First** - Optimized for small screens
- **Tablet Support** - Perfect for mid-size devices
- **Desktop** - Full-featured experience
- **Touch Friendly** - Easy interaction on mobile

### 🎨 UI/UX
- **Modern Design** - Clean, professional interface
- **Consistent Styling** - Tailwind-based design system
- **Toast Notifications** - User feedback
- **Loading States** - Better user experience
- **Error Handling** - Graceful error messages

---

## 💻 Development Guidelines

### Code Style

The project follows these conventions:
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- React Hook Form for form management
- Custom hooks for reusable logic

## Security Considerations

This is a demo application. For production use, ensure you:
- Implement proper password hashing
- Use HTTPS
- Add CSRF protection
- Implement rate limiting
- Add input sanitization
- Use secure session management
- Add proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
# kutum-frontend
