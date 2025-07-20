# Healthcare SaaS Platform - Team Development Guide

## 🚀 Quick Start for New Team Members

### Prerequisites
- Node.js 16+ installed
- Git access to this repository
- Basic understanding of React, Firebase, and Tailwind CSS

### Local Development Setup
```bash
# 1. Clone and install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:3001
```

### 🔧 Development Mode
**Current Status**: `DEV_MODE = true` (development mode active)
- **Login Bypass**: Authentication is bypassed for faster development
- **Mock Data**: Uses demo users and test data
- **Hot Reload**: Changes update automatically

## 📁 Project Structure

### 🎯 Main Files (Start Here)
```
src/
├── App.jsx              # 🔥 MAIN APPLICATION (6,400+ lines)
├── index.jsx            # React DOM entry point
├── index.css            # Global styles + Tailwind
└── config/
    ├── constants.js     # ✅ Configuration constants
    └── firebase.js      # Firebase configuration
```

### 📦 Modular Components (Available for Use)
```
src/components/
├── ui/                  # Reusable UI components
├── auth/               # Authentication components
├── views/              # Page/view components
└── layout/             # Layout components
```

### 🏗️ App.jsx Structure (The Monolith)

**Navigation Guide** (Use Ctrl+G + line number):
```
📋 TABLE OF CONTENTS:
├── Lines 1-51      → Dependencies & Imports
├── Lines 52-101    → Map Configuration & Components  
├── Lines 102-241   → Development Flags & UI Components
├── Lines 242-257   → Firebase Configuration
├── Lines 258-345   → Data Models & Constants
├── Lines 346-1030  → Business Logic & Mock Data
├── Lines 1031-1167 → Team Data & Utility Functions
├── Lines 1168-1896 → Helper Components
├── Lines 1897-1968 → Authentication System
├── Lines 1969-2207 → Custom Hooks & Core Components
├── Lines 2208-2346 → Main Application UI
├── Lines 2347-6323 → Feature Views & Business Components
└── Lines 6324-6366 → Main App Export Function
```

## 🏥 Business Domain Understanding

### Healthcare Service Platform
This is a **healthcare service delivery platform** that manages:
- **Programs**: Healthcare intervention programs
- **Clients**: Program participants and their data
- **Staff**: Clinical team members and case managers
- **Organizations**: Multi-tenant organizational structure
- **Assessments**: Client evaluations and progress tracking
- **Documentation**: Notes, reports, and file management

### User Roles
- **Platform Owner**: Full system administration
- **Clinical Director**: Program oversight and management
- **Case Manager**: Direct client service delivery
- **Family Advocate**: Family support services
- **Supervisor**: Team supervision and quality assurance

## 💼 Monetization & Business Features

### Multi-Tenant Architecture
- Organization-based data separation
- Role-based access control
- Configurable permissions per organization

### Professional Features
- Advanced analytics dashboard
- Automated report generation
- Client outcome tracking
- Staff performance metrics
- Geographic service mapping
- Document management system

## 🛠️ Development Workflow

### ⚠️ CRITICAL RULES
1. **NEVER break existing functionality**
2. **Test after every change**
3. **Use DEV_MODE for development**
4. **Keep changes small and incremental**
5. **Document all modifications**

### Safe Development Process
```bash
# 1. Always start with app running
npm run dev

# 2. Make small changes
# 3. Check browser for errors
# 4. Test core functionality
# 5. Commit working changes

git add .
git commit -m "Small safe improvement: [description]"
```

### 🧪 Testing Checklist
Before committing changes, verify:
- [ ] App loads without errors
- [ ] Authentication works (login/logout)
- [ ] Dashboard displays correctly
- [ ] Charts and data visualizations render
- [ ] Map functionality works
- [ ] No console errors in browser

## 🔧 Configuration Management

### Environment Setup
- **Development**: `DEV_MODE = true` in `/src/config/constants.js`
- **Production**: `DEV_MODE = false` + proper Firebase config

### Firebase Configuration
Located in `/src/config/firebase.js` - contains production credentials

### Key Configuration Files
- `/src/config/constants.js` - Application constants
- `/src/App.jsx` lines 242-257 - Firebase initialization
- `/src/index.jsx` - Service worker registration

## 📊 Features Overview

### Dashboard & Analytics
- Real-time data visualization
- Client progress tracking
- Program effectiveness metrics
- Geographic service distribution

### Client Management
- Comprehensive client profiles
- Assessment tracking
- Note and document management
- Family information and history

### Program Administration
- Program setup and configuration
- Staff assignment and management
- Outcome tracking and reporting
- Quality assurance workflows

### Geographic Features
- Interactive service area mapping
- Radius-based program search
- Geographic program distribution
- Location-based client services

## 🚨 Common Issues & Solutions

### White Screen / App Won't Load
```bash
# Check console errors
# Usually syntax errors in App.jsx

# Restore last working version
git checkout HEAD~1 src/App.jsx

# Or restore from backup
git restore src/App.jsx
```

### Firebase Connection Issues
1. Check internet connection
2. Verify Firebase configuration
3. Check browser console for specific errors
4. Ensure DEV_MODE is properly set

### Map Not Loading
1. Check Leaflet CSS imports
2. Verify internet connection for map tiles
3. Check browser console for Leaflet errors

## 📝 Code Style & Standards

### Existing Patterns
- **Functional Components**: All components use hooks
- **Tailwind CSS**: Utility-first styling approach
- **Firebase**: Firestore for data, Auth for authentication
- **Lucide Icons**: Consistent icon library usage

### Naming Conventions
- **Components**: PascalCase (e.g., `SkeletonLoader`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEV_MODE`)
- **Files**: camelCase for JS, PascalCase for components

## 🎯 Immediate Next Steps

### Phase 1: Team Onboarding ✅
- [x] Documentation created
- [x] Development guide established
- [x] Safe development process defined

### Phase 2: Safe Organization (In Progress)
- [x] Add configuration import structure
- [ ] Extract utility functions to separate files
- [ ] Create proper constants management
- [ ] Add component prop documentation

### Phase 3: Gradual Modernization
- [ ] Add TypeScript gradually
- [ ] Implement proper testing
- [ ] Create component library
- [ ] Optimize build process

## 👥 Team Collaboration

### Code Reviews
- Focus on maintaining functionality
- Check for performance implications
- Verify mobile responsiveness
- Ensure accessibility standards

### Git Workflow
```bash
# Create feature branches for new work
git checkout -b feature/small-improvement

# Make small, focused commits
git commit -m "feat: add utility function for date formatting"

# Test thoroughly before merging
npm run dev
# Test in browser

# Merge when stable
git checkout main
git merge feature/small-improvement
```

## 📞 Support & Resources

### Key Dependencies Documentation
- [React 18 Docs](https://react.dev/)
- [Firebase v9 Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet Maps](https://leafletjs.com/reference-1.9.4.html)
- [Recharts](https://recharts.org/en-US/api)

### Internal Resources
- **Main App Structure**: Lines 1-30 in App.jsx (table of contents)
- **Configuration**: `/src/config/constants.js`
- **Business Logic**: Lines 2347+ in App.jsx
- **Authentication**: Lines 1897-1968 in App.jsx

---

**Last Updated**: July 20, 2025  
**Status**: ✅ Stable and Ready for Team Development  
**Next Review**: After Phase 2 completion
