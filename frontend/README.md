# Labely - Gamified Data Labeling App

A mobile-first React Native Expo app for gamified data labeling with two user roles: Requester and Labeler.

## Features

### 🎯 For Requesters
- **Dashboard**: View all labeling jobs with status, progress, and confidence scores
- **Create Job Wizard**: Multi-step wizard to create labeling jobs with:
  - Task type selection (Binary, Multi-class, Object Detection)
  - Class definition
  - Data upload (placeholder)
  - Budget and quality settings (consensus, ELO threshold, gold-check frequency)
- **Job Details**: Detailed view with progress charts and confidence timeline

### 🎮 For Labelers
- **Swipe-style Task UI**: Different interfaces for different task types:
  - Binary: Left/Right buttons
  - Multi-class: Row of buttons
  - Object Detection: Mock bounding-box drawing overlay
- **Gamification Features**:
  - ELO rating badge
  - Streak counter
  - Per-item rewards
  - Session progress tracking
  - Gold standard items with warnings
  - ELO change indicators
  - End-session summary modal

### 🌍 Global Features
- Landing page with app overview
- Profile page with wallet, stats, achievements, and settings
- Dark-friendly, minimalistic UI
- Clean card-based layout
- Progress bars and modals

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## Project Structure

```
frontend/
├── app/                      # Screens (Expo Router)
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Landing page
│   │   ├── requester.tsx    # Requester dashboard
│   │   ├── labeler.tsx      # Labeler task UI
│   │   └── profile.tsx      # User profile
│   ├── create-job.tsx       # Create job wizard
│   └── job-details.tsx      # Job details page
├── components/
│   └── ui/                  # Reusable UI components
│       ├── Card.tsx
│       ├── Button.tsx
│       ├── ProgressBar.tsx
│       ├── Badge.tsx
│       └── Modal.tsx
├── constants/
│   └── theme.ts             # App theme (colors, spacing, fonts)
├── data/
│   └── mockData.ts          # Mock data for development
├── types/
│   └── index.ts             # TypeScript type definitions
└── hooks/                   # Custom React hooks
```

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: StyleSheet API with custom theme
- **State**: Local state with React hooks (no backend)
- **Icons**: Ionicons from @expo/vector-icons

## Mock Data

The app uses mock data defined in `data/mockData.ts`:
- **Jobs**: Sample labeling jobs with different task types and statuses
- **Tasks**: Sample tasks for labeling (binary, multi-class, object detection)
- **User Profile**: Mock user data with ELO, stats, and wallet balance
- **Charts**: Mock data for progress and confidence charts

## Ready for Backend Integration

The app is structured to be easily connected to a real API:

1. **API Layer**: Create an `api/` folder with API client functions
2. **State Management**: Add Redux, Zustand, or React Query for global state
3. **Replace Mock Data**: Replace imports from `data/mockData.ts` with API calls
4. **Add Authentication**: Integrate auth flow (e.g., Firebase, Auth0)
5. **File Upload**: Implement real file upload for images
6. **Real-time Updates**: Add WebSocket support for live job progress

## Theme Customization

Edit `constants/theme.ts` to customize:
- **Colors**: Light and dark mode colors
- **Spacing**: Consistent spacing values
- **Border Radius**: Component border radius values
- **Font Sizes**: Typography scale
