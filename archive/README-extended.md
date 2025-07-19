# Healthcare Program Management Platform

A professional, modern React application for managing healthcare programs with comprehensive features for program tracking, client management, and analytics.

## 🚀 Features

- **Role-based Authentication** - Support for Clinical Coach, Admin 1-3 roles
- **Program Management** - Comprehensive directory of healthcare programs
- **Client Plan Tracking** - Manage client placements and progress
- **Interactive Maps** - Geographic visualization of programs
- **Analytics Dashboard** - Data visualization and reporting
- **Real-time Notifications** - System-wide notification management
- **Dark/Light Theme** - Customizable theme support
- **Progressive Web App** - Offline support and mobile app-like experience
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 18 with modern hooks
- **Styling**: Tailwind CSS with dark mode support
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Maps**: Leaflet & React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Type Safety**: TypeScript support
- **Code Quality**: ESLint + Prettier

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── views/          # Page-level components
│   ├── Auth.jsx        # Authentication component
│   ├── Navigation.jsx  # Navigation sidebar
│   ├── MainApp.jsx     # Main app container
│   └── ErrorBoundary.jsx # Error handling
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── config/             # Configuration files
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for authentication and database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthcare-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/config/firebase.js` with your config

4. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Feature-level testing
- **Coverage Reports**: Track test coverage
- **Test Utilities**: Custom testing helpers

Run tests with:
```bash
npm test
```

## 🎨 Customization

### Themes
The application supports multiple color themes and dark/light modes. Customize in:
- `src/hooks/useThemeManager.js`
- `src/config/constants.js`

### Configuration
Key configuration files:
- `src/config/firebase.js` - Firebase settings
- `src/config/constants.js` - App constants
- `tailwind.config.js` - Tailwind CSS configuration

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Easy deployment with automatic CI/CD
- **Netlify**: Static site hosting with form handling
- **Firebase Hosting**: Integrated with Firebase backend
- **AWS S3**: Static website hosting

## 📱 Progressive Web App

The application includes PWA features:
- Offline functionality
- App-like experience on mobile
- Push notifications support
- Automatic updates

## 🔒 Security

- Firebase security rules for data protection
- Environment variable management
- Input validation and sanitization
- HTTPS enforcement in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📊 Performance

The application is optimized for performance:
- Code splitting and lazy loading
- Bundle optimization with Vite
- Image optimization
- Lighthouse performance monitoring

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection**: Ensure Firebase config is correct
2. **Maps Not Loading**: Check Leaflet CSS imports
3. **Build Errors**: Clear node_modules and reinstall
4. **Type Errors**: Run `npm run type-check` for details

### Development Mode

Set `DEV_MODE = true` in `src/config/constants.js` to bypass authentication during development.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

Built with ❤️ for healthcare professionals
