# VSC Unia App

A React Native Expo application with package name `com.vscunia.app`.

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── utils/          # Utility functions
├── services/       # API and backend logic
└── constants/      # Shared constants
```

## Configuration

- **Package Name**: `com.vscunia.app`
- **App Name**: VSC Unia App
- **Expo SDK**: ~53.0.22
- **React Native**: 0.79.6
- **React**: 19.0.0

## Development

The app uses the new React Native architecture (Fabric) and supports:
- iOS (with bundle identifier: com.vscunia.app)
- Android (with package: com.vscunia.app)
- Web

## Building for Production

To build for production, use Expo's build services or EAS Build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```
# vsc_uniaapp_prod
# vsc_uniaapp_prod
