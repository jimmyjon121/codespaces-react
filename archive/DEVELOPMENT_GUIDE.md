# Healthcare Aftercare Platform - Development Team Guide

## 📁 Project Structure

This healthcare aftercare platform is organized into feature-based modules to enable parallel development by multiple team members.

## 🏗️ Module Organization

```
src/
├── components/           # Shared UI components
│   ├── ui/              # Basic UI elements (buttons, forms, etc.)
│   └── layout/          # Layout components (header, sidebar, etc.)
├── modules/             # Feature modules (assign developers here)
│   ├── admin/           # Administrative functions ✅ CONFIGURED
│   ├── ai/              # AI features (HIPAA-compliant) ✅ CONFIGURED
│   ├── auth/            # Authentication & authorization ✅ READY
│   ├── clients/         # Client/patient management ✅ READY
│   ├── dashboard/       # Main dashboard ✅ READY
│   ├── analytics/       # Reporting & analytics ✅ READY
│   └── programs/        # Treatment programs ✅ READY
└── shared/              # Shared utilities and services
```

## 👥 Module Assignment Strategy

### Developer Roles & Module Ownership

1. **Lead Developer**: Overall architecture, auth module, shared components
2. **Frontend Developer 1**: Dashboard, analytics modules
3. **Frontend Developer 2**: Clients, programs modules  
4. **Backend/AI Developer**: AI module, admin module
5. **Junior Developer**: UI components, testing support

### Module Independence Features

Each module is designed to be:
- **Self-contained**: All related components, services, and types in one folder
- **Independently developable**: Minimal cross-module dependencies
- **Testable in isolation**: Each module can be tested separately
- **Deployable separately**: Potential for micro-frontend architecture

## 🚀 Development Workflow

### 1. Module Development Rules
```bash
# Each developer works primarily in their assigned module
src/modules/[your-module]/

# Shared components go in:
src/components/

# Shared utilities go in:
src/shared/
```

### 2. Import Conventions
```javascript
// Import from your own module
import { ClientList } from './components/ClientList';

// Import from other modules (through index)
import { Admin } from '../modules';
import { useAuth } from '../modules/auth';

// Import shared components
import { Button } from '../../components/ui/Button';
```

### 3. File Naming Conventions
- **Components**: PascalCase (`ClientList.jsx`)
- **Services**: camelCase (`clientService.js`)
- **Hooks**: camelCase starting with 'use' (`useClients.js`)
- **Config**: camelCase ending with 'Config' (`clientConfig.js`)

## 📋 Module Details

### 🔧 Admin Module (`/modules/admin/`) ✅ CONFIGURED
**Lead**: TBD
**Purpose**: Administrative functions, user management, system settings
**Status**: AdminSettings and adminConfig already moved and configured
**Key Components**:
- ✅ AdminSettings (moved from src/)
- ✅ adminConfig (moved from src/)
- UserManagement
- SystemConfiguration
- SubscriptionManagement

### 🤖 AI Module (`/modules/ai/`) ✅ CONFIGURED  
**Lead**: TBD  
**Purpose**: HIPAA-compliant AI features and recommendations
**Status**: AI services already moved and configured
**Key Components**:
- ✅ HIPAACompliantRecommendations (moved from src/)
- ✅ OnPremisesAI (moved from src/)
- RecommendationEngine
- AIConfiguration

### 🔐 Auth Module (`/modules/auth/`) ✅ READY
**Lead**: TBD
**Purpose**: Authentication, authorization, session management
**Key Components**:
- LoginForm
- RegisterForm
- ProtectedRoute
- SessionManager

### 👥 Clients Module (`/modules/clients/`) ✅ READY
**Lead**: TBD
**Purpose**: Patient/client management and clinical coach assignments
**Features**: Clinical coach column integration (completed)
**Key Components**:
- ClientList (with clinical coach column)
- ClientProfile
- ClinicalCoachAssignment
- ClientOnboarding

### 📊 Dashboard Module (`/modules/dashboard/`) ✅ READY
**Lead**: TBD
**Purpose**: Main application dashboard and overview
**Key Components**:
- DashboardHome
- MetricsOverview
- QuickActions
- RecentActivity

### � Analytics Module (`/modules/analytics/`) ✅ READY
**Lead**: TBD
**Purpose**: Data analysis, reporting, metrics
**Key Components**:
- AnalyticsDashboard
- ClientMetrics
- ProgramEffectiveness
- ReportGenerator

### 🏥 Programs Module (`/modules/programs/`) ✅ READY
**Lead**: TBD
**Purpose**: Treatment programs and care protocols
**Note**: Specialties removed for cleaner UI (completed)
**Key Components**:
- ProgramList
- ProgramBuilder
- CareProtocols
- ProgramTemplates

## 🚀 Getting Started

### 1. Choose Your Module
- Review the module descriptions above
- Discuss with team lead for assignment
- Update the "Lead" field in module documentation

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests for your module
npm test -- --testPathPattern=src/modules/[your-module]
```

### 3. Development Process
1. Create feature branch: `git checkout -b feature/[module]-[feature-name]`
2. Develop in your module directory
3. Test your changes locally
4. Submit PR for review
5. Merge after approval

## 📝 Code Standards

### Component Structure
```javascript
// Component file structure
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // Component logic here
  return (
    <div className="component-wrapper">
      {/* JSX here */}
    </div>
  );
};

export default ComponentName;
```

### Service Structure
```javascript
// Service file structure
class ModuleService {
  constructor() {
    // Initialization
  }

  async method1() {
    // Implementation
  }

  async method2() {
    // Implementation
  }
}

export default new ModuleService();
```

## 🔒 HIPAA Compliance Requirements

- **PHI Handling**: All client data must use HIPAA-compliant services
- **AI Features**: Only on-premises AI solutions for PHI processing
- **Logging**: No PHI in logs or error messages
- **Data Storage**: Encrypted at rest and in transit

## 💰 Subscription Tiers

The platform supports multiple subscription levels:
- **Basic** ($29/month): Core features
- **Professional** ($99/month): Advanced analytics
- **AI Enhanced** ($199/month): Rule-based recommendations
- **AI Enterprise** ($499/month + hardware): Full on-premises AI

## 📞 Contact & Support

- **Technical Lead**: TBD
- **Project Manager**: TBD  
- **HIPAA Compliance Officer**: TBD

## ✅ Implementation Status

### Completed Features
- ✅ Clinical coach column integration
- ✅ Specialty features removed for cleaner UI
- ✅ Admin settings with AI configuration tabs
- ✅ HIPAA-compliant AI architecture planned
- ✅ Modular code structure implemented
- ✅ Module index files created

### Next Development Steps
1. **Assign developers to modules** - Update "Lead" fields
2. **Create initial components** - Build out module components
3. **Update import paths** - Fix App.jsx to use new structure
4. **Set up testing framework** - Module-specific tests
5. **Establish CI/CD pipeline** - Automated testing and deployment

---

*Last Updated: Current Session*
*Version: 2.0 - Professional Modular Architecture*

### **Module 4: Admin & Configuration**
**Assignee: Developer D**
**Files to work on:**
- `src/modules/admin/`
- `src/config/`

### **Module 5: AI & Recommendations**
**Assignee: Developer E**
**Files to work on:**
- `src/modules/ai/`
- `src/services/ai/`

## 🔄 Shared Dependencies

All developers need access to:
- `src/components/ui/` - Shared UI components
- `src/components/layout/` - Layout components
- `src/services/api/` - API configuration
- `src/config/` - App configuration
- `src/hooks/` - Shared hooks

## 📦 Module Independence

Each module should:
1. Have its own components, hooks, and services
2. Export a clear API for other modules to use
3. Minimize dependencies on other modules
4. Include its own tests and documentation
