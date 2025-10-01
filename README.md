🧪 Employee Absence Calendar - Technical Assessment
✨ Project Overview
This project was developed as part of a technical assessment for a Frontend Developer (Vue.js) role. The application is an interactive absence calendar that displays employee absences across an entire year. It was built using Nuxt 3, Vuetify, and TypeScript, with data handling structured for future GraphQL backend integration, though currently using simulated data.

🚀 Quick Start
Installation & Setup
bash
# Clone the repository or unzip the provided .zip file
# Navigate to the project directory
```bash
    cd nuxt-vuetify-absences
```

# Install dependencies
```bash
    npm install
```

# Start development server
```bash
   npm run dev
```
The application will be available at http://localhost:3000

🎯 Key Features

✅ Core Functionality

Full-year absence table with employees listed vertically and dates horizontally

Intuitive cell coloring system:

🔴 Red: Employee is absent

🟢 Green: Employee is present

⚫ Gray: Weekends (non-working days)

Bidirectional virtual scrolling (horizontal & vertical) for optimal performance

Interactive absence management through clickable cells

✅ User Experience

Responsive design that works seamlessly across desktop, tablet, and mobile devices

Real-time state updates when absences are created or modified

Persistent state management during the session

Interactive dialog for creating and editing absences spanning multiple days

Visual feedback with hover effects and tooltips

✅ Technical Excellence

TypeScript throughout the codebase for type safety and better developer experience

Modular architecture with reusable, maintainable components

Performance-optimized rendering for large datasets (365 days × multiple employees)

Future-ready data structure prepared for GraphQL backend integration

🛠️ Technical Implementation

State Management

Composition API with custom store pattern for reactive state management

Centralized data handling for employees and absences

Type-safe operations with full TypeScript support

Performance Optimizations
Virtual scrolling implementation to handle rendering of large datasets efficiently

Efficient re-rendering strategies for calendar updates

Optimized DOM operations for smooth scrolling and interactions

UI/UX Enhancements
Vuetify components for consistent and accessible UI

Responsive grid system adapting to different screen sizes

Interactive elements with proper visual feedback

Accessibility considerations in component design

📋 Technical Requirements Fulfilled

Requirement	Implementation Status

Vue.js with Nuxt framework	✅ Fully implemented

Vuetify for UI components	✅ Complete integration

TypeScript codebase	✅ 100% TypeScript

Virtual scrolling (both directions)	✅ Custom implementation

Cell color coding	✅ Red/Green/Gray system

Absence management dialog	✅ Full CRUD operations

Real-time updates	✅ Reactive state management

Responsive design	✅ Mobile-first approach

Modular component structure	✅ SFC architecture

GraphQL-ready data structure	✅ Prepared for integration

🔧 Technical Decisions

Architecture Choices

Nuxt 3 for modern Vue.js development with built-in optimizations

Composition API for better logic reuse and TypeScript integration

Custom store pattern instead of Pinia/Vuex for simplicity and control

Component-based architecture for maximum reusability and maintainability

Performance Considerations
Virtual scrolling custom implementation to handle 365+ date columns efficiently

Efficient state updates minimizing unnecessary re-renders

Optimized date calculations for quick absence lookups

CSS transforms for smooth scrolling animations

🎨 UI/UX Features

Sticky headers and employee names for easy navigation

Today highlighting for quick orientation

Interactive tooltips showing detailed absence information

Smooth animations and transitions for better user experience

Mobile-optimized layout with responsive breakpoints



👨‍💻 Development Notes
Challenges Addressed
Performance with large datasets - Solved with custom virtual scrolling

TypeScript integration - Full type safety across components

Responsive sticky elements - Complex CSS positioning for headers

State persistence - Maintained during component updates and refreshes

Code Quality Highlights
Clean, readable code with consistent formatting

Comprehensive TypeScript interfaces for all data structures

Modular component design following Vue best practices

Proper separation of concerns between UI and business logic

📞 Contact

Victor Vera

Frontend Developer

📧 Email: victorverazambrana@gmail.com

🔗 GitHub: https://github.com/THEBESTgit


