## Description
This pull request implements the foundational frontend architecture as defined in Phase 2, Phase 3, and Phase 11. 

### Key Features Implemented:
- **Project Structure**: Configured Redux Toolkit, React Router, and initialized Tailwind CSS v4.
- **Admin Layout**: Created a responsive `AdminLayout` wrapping the protected routes.
- **Premium UI Aesthetics**:
  - Implemented glassmorphism effects for the Navbar and Sidebar.
  - Added subtle, dynamic gradient blobs and architectural grid backgrounds.
  - Replaced default fonts with the 'Outfit' typography for a modern look.
- **Theme System**: Fully integrated Light and Dark mode using Redux (`uiSlice`) and synced with both Material UI's ThemeProvider and Tailwind CSS.
- **Routing**: Set up placeholders for Login, Register, and Dashboard routes.

### Related Checklist Phases:
- [x] Phase 1: Project Setup
- [x] Phase 2: Dashboard UI System
- [x] Phase 3: Routing System
- [x] Phase 11: Theme System
