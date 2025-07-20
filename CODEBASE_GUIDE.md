# Codebase Guide for Healthcare SaaS Platform

## 🚀 Quick Start
- **Main Entry Point**: `/src/App.jsx` (6,366 lines - monolithic but well-organized)
- **Development Mode**: `DEV_MODE = true` (line 104) - Set to `false` for production
- **Local Development**: `npm run dev` → `http://localhost:3001`

## 📁 Current File Structure

### Core Files
- `/src/App.jsx` - **Main application** (all components and logic)
- `/src/index.jsx` - React DOM entry point
- `/src/index.css` - Global styles and Tailwind imports

### Modular Components (Available but Optional)
- `/src/components/ui/` - Reusable UI components
- `/src/components/auth/` - Authentication components  
- `/src/components/views/` - View components
- `/src/components/layout/` - Layout components
- `/src/services/` - Data services and API calls

## 🏗️ App.jsx Structure Overview

### Section Organization (Well-Documented with Comments)
```
Lines 1-51     → Imports & Dependencies
Lines 52-71    → Leaflet Map Configuration  
Lines 72-101   → Map Components (RadiusSearch)
Lines 102-105  → Development Flags
Lines 106-241  → UI Components (SkeletonLoader, EmptyState, etc.)
Lines 242-257  → Firebase Configuration & Initialization
Lines 258-265  → User Roles & Theme Constants
Lines 266-345  → Program & Clinical Staff Data
Lines 346-906  → Client Assignment Logic
Lines 907-1030 → Mock Data Generation
Lines 1031-1106→ Family First Team Data
Lines 1107-1167→ Utility Functions
Lines 1168-1896→ Helper Components
Lines 1897-1968→ Authentication Component
Lines 1969-2015→ Custom Hooks
Lines 2016-2207→ Main UI Components
Lines 2208-2346→ Main Application UI Logic
Lines 2347-6323→ View Components & Features
Lines 6324-6366→ Main App Export Function
```

## 🔧 Development Configuration

### Important Flags
- **DEV_MODE** (line 104): `true` = bypass login, `false` = real authentication
- **Firebase Config** (line 243): Production Firebase credentials

### Key Dependencies
- **React 18** - Core framework
- **Firebase** - Authentication & Firestore database
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

## 🏥 Business Logic Overview

### User Roles System
- **Platform Owner** - Full system access
- **Clinical Director** - Program oversight
- **Case Manager** - Client management
- **Family Advocate** - Family support
- **Supervisor** - Team supervision

### Core Features
1. **Authentication & Authorization** (lines 1897-1968)
2. **Client Management** (extensive client data & case tracking)
3. **Program Analytics** (charts, reports, KPIs)
4. **Map Visualization** (geographic program distribution)
5. **Document Management** (notes, reports, file uploads)
6. **Notification System** (real-time updates)

### Data Structure
- **Programs** - Healthcare service programs
- **Clients** - Program participants
- **Staff** - Clinical team members
- **Organizations** - Organizational units
- **Assessments** - Client evaluations
- **Notes** - Case documentation

## 🎯 Monetization-Ready Features

### Multi-Tenancy Support
- Organization-based data separation
- Role-based access control
- Configurable user permissions

### Professional Features
- Advanced analytics and reporting
- Document generation
- Client outcome tracking
- Staff performance metrics
- Administrative oversight tools

## 🚦 Development Best Practices

### Current State: **WORKING & STABLE**
- ✅ All features functional
- ✅ Firebase integration working
- ✅ Authentication system operational
- ✅ Data visualization working
- ✅ Map integration functional

### Safe Development Approach
1. **Never break existing functionality**
2. **Test after every small change**
3. **Use feature flags for new features**
4. **Keep backup of working state**
5. **Document all changes**

## 🔄 Recommended Next Steps (Safe Refactoring)

### Phase 1: Documentation & Standards
- [ ] Add JSDoc comments to functions
- [ ] Create component prop documentation
- [ ] Establish coding standards document

### Phase 2: Configuration Management
- [ ] Extract configuration to separate files
- [ ] Environment-based configuration
- [ ] Build process optimization

### Phase 3: Gradual Component Extraction
- [ ] Start with utility functions
- [ ] Extract constants and configuration
- [ ] Move reusable components to separate files
- [ ] Maintain backward compatibility

### Phase 4: Code Organization
- [ ] Create proper folder structure
- [ ] Implement proper imports/exports
- [ ] Add unit tests for critical functions

## ⚠️ Critical Notes for Team

### DO NOT CHANGE
- Main App.jsx structure (keep it working)
- DEV_MODE flag (until ready for production)
- Firebase configuration
- Existing component interfaces

### SAFE TO MODIFY
- Add new optional components
- Improve comments and documentation
- Add new features as separate components
- Enhance styling and UI improvements

## 🛠️ Debugging & Troubleshooting

### Common Issues
1. **White screen** - Check browser console for syntax errors
2. **Firebase errors** - Verify configuration and internet connection
3. **Map not loading** - Check Leaflet CSS imports
4. **Build errors** - Verify all imports are correct

### Development Tools
- React Developer Tools browser extension
- Firebase console for database inspection
- Browser developer tools for debugging
- VS Code integrated terminal for commands

---

**Last Updated**: July 20, 2025  
**Status**: Stable and Production-Ready  
**Team Focus**: Maintain stability while improving organization
