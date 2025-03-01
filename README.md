# Globetrotter - Geography Quiz Game

Globetrotter is an interactive geography quiz game where players test their knowledge of world cities through engaging clues and facts.

## Features

- 🌍 Geography-based quiz game
- 🎯 Multiple choice questions with city options
- ✨ Interactive animations and feedback
- 🏆 Score tracking
- 📱 Mobile-responsive design
- 🔗 Share scores via WhatsApp or native share

## Tech Stack

### Frontend
- React 18
- Framer Motion for animations
- React Router for navigation
- Axios for API calls
- CSS Modules for styling

### Backend
- ASP.NET Core 7
- Entity Framework Core
- SQL Server
- RESTful API architecture

## Setup
### Frontend Setup
bash
Navigate to client directory
cd globetrotter-client
Install dependencies
npm install
Start development server
npm start

### Backend Setup
bash
Navigate to API directory
cd globetrotter-api
Restore packages
dotnet restore
Update database
dotnet ef database update
Run the API
dotnet run

globetrotter/
├── globetrotter-client/     # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/         # CSS styles
│   │   └── config.js       # Configuration
│   └── package.json
│
└── globetrotter-api/        # .NET backend
    ├── Controllers/        # API endpoints
    ├── Models/            # Data models
    ├── Data/             # Database context
    └── Program.cs        # Entry point

### Prerequisites
- Node.js (v16+)
- .NET 7 SDK
- SQL Server


### Frontend
- **React**: Chosen for its component-based architecture and robust ecosystem
- **Framer Motion**: Provides smooth animations and transitions
- **CSS Modules**: Ensures style encapsulation and maintainability

### Backend
- **ASP.NET Core**: Offers high performance and cross-platform capabilities
- **Entity Framework Core**: Simplifies database operations with ORM
- **SQL Server**: Provides reliable data persistence

## Development Decisions

1. **Component Structure**: Separated concerns into reusable components (CityOptions, ShareGame, etc.)
2. **State Management**: Used React hooks for local state management
3. **API Integration**: Centralized API configuration in config.js
4. **Animation**: Implemented subtle animations for better user experience
5. **Error Handling**: Comprehensive error handling on both frontend and backend

## Future Improvements

- [ ] Add user authentication
- [ ] Implement leaderboards
- [ ] Add more game modes
- [ ] Include difficulty levels
- [ ] Add more sharing options
- [ ] Implement progressive web app features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details