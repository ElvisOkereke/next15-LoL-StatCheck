# OP.GG Clone - League of Legends Match History Tracker

A modern, interactive League of Legends match history application built with Next.js 15, featuring real-time match data, comprehensive statistics, and a sleek user interface inspired by OP.GG.

## 🎮 Features

### **Match History & Analytics**
- **Interactive Match Cards**: Expandable match details with comprehensive player statistics
- **Advanced Filtering**: Filter by wins/losses, ranked/normal games, and more
- **Smart Sorting**: Sort by recency, KDA, damage, game duration
- **Real-time Statistics**: Win rate, average KDA, damage, CS, and performance metrics
- **Team Overview**: Complete team compositions with detailed player stats

### **Visual Experience**
- **Game Assets Integration**: Real champion portraits, item icons, summoner spell icons
- **Dynamic Theming**: Win/loss color coding throughout the interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Loading States**: Smooth transitions and proper loading indicators

### **Data Management**
- **MongoDB Integration**: Efficient data storage and retrieval
- **Riot API Integration**: Real-time match data from official League of Legends API
- **Smart Caching**: Prevents redundant API calls and improves performance
- **Data Validation**: Robust error handling and data validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript
- **Backend**: Next.js API Routes with Server Actions
- **Database**: MongoDB with native driver
- **External APIs**: Riot Games API, Data Dragon (for game assets)
- **Styling**: CSS-in-JS with styled-jsx
- **Development**: Turbopack for fast development builds

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Riot Games API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd next15-opgg
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_RIOT_API_KEY=your_riot_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### **Search for Players**
1. Enter a summoner name and tag (e.g., "SummonerName#TAG")
2. Select region (NA1, EUW1, etc.)
3. Click search to load player profile

### **View Match History**
- **Basic View**: See match results, champions, KDA, and items at a glance
- **Expanded View**: Click any match to see detailed statistics
- **Filter & Sort**: Use controls to filter by game type or sort by performance
- **Statistics Overview**: Toggle detailed statistics panel for overall performance

### **Match Details**
- **Overview Tab**: Team compositions, objectives, and match summary
- **Builds Tab**: Final items, runes, and build progression
- **Timeline Tab**: Detailed statistics including gold, CS, vision, and damage metrics

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── client/          # Client-side React components
│   │   │   ├── Match.tsx    # Individual match display
│   │   │   ├── MatchHistory.tsx # Match history container
│   │   │   └── SearchBar.tsx    # Player search interface
│   │   ├── server/          # Server-side components
│   │   │   └── Db.tsx       # Database operations
│   │   └── actions/         # Server actions
│   │       └── dbActions.tsx # Database action wrappers
│   ├── hooks/               # Custom React hooks
│   │   └── useIcons.ts      # Icon loading management
│   ├── utils/               # Utility functions
│   │   └── iconUtils.ts     # Game asset management
│   ├── types/               # TypeScript definitions
│   │   └── types.tsx        # Type definitions
│   ├── profile/             # Profile page
│   └── home/                # Home page
```

## 🔧 Key Components

### **Match Component**
- Displays individual match information
- Expandable with tabbed interface
- Shows champion, items, KDA, and detailed statistics
- Handles win/loss styling and interactions

### **MatchHistory Component**
- Manages collection of matches
- Provides filtering and sorting capabilities
- Displays aggregate statistics
- Handles loading states and error conditions

### **Icon System**
- Fetches and caches game assets from Data Dragon
- Provides fallbacks for missing or failed images
- Optimizes performance with intelligent caching

## 🎨 Features Deep Dive

### **Interactive Match Cards**
- **Expandable Interface**: Click to reveal detailed match information
- **Tabbed Navigation**: Overview, Builds, and Timeline tabs
- **Visual Feedback**: Smooth animations and hover effects
- **Responsive Design**: Adapts to different screen sizes

### **Advanced Filtering System**
- **Game Type Filters**: All games, wins only, losses only, ranked only, normal only
- **Sort Options**: Most recent, oldest first, best KDA, highest damage, longest games
- **Real-time Updates**: Instant filtering without page reloads
- **Reset Functionality**: Quick reset to default view

### **Comprehensive Statistics**
- **Overview Panel**: Total games, wins, losses, win rate, average KDA
- **Performance Metrics**: Average kills/deaths/assists, damage, CS
- **Visual Indicators**: Color-coded statistics for easy reading
- **Collapsible Interface**: Toggle visibility to save space

## 🔗 API Integration

### **Riot Games API**
- **Account Data**: Fetch summoner information by Riot ID
- **Match History**: Retrieve recent match IDs for players
- **Match Details**: Get comprehensive match data including all participants
- **Rate Limiting**: Proper handling of API rate limits

### **Data Dragon**
- **Champion Assets**: High-quality champion portraits
- **Item Icons**: Complete item database with images
- **Summoner Spells**: Spell icons and information
- **Version Management**: Automatic updates with new patches

## 🛡️ Error Handling

- **Defensive Programming**: Null checks throughout the application
- **Graceful Fallbacks**: Text alternatives when images fail to load
- **User Feedback**: Clear error messages and loading states
- **Data Validation**: Robust validation for API responses

## 🚀 Performance Optimizations

- **Smart Caching**: Icon and data caching to reduce API calls
- **Lazy Loading**: Components load on demand
- **Memoization**: React.useMemo for expensive calculations
- **Efficient Rendering**: Optimized re-renders with proper dependencies

## 📱 Screenshots

### Player Profile
![Player Profile](https://github.com/user-attachments/assets/bbb29869-c336-4fdb-a59b-98a1b6289d3b)

### System Architecture
![System Design](https://github.com/user-attachments/assets/fcacb4fc-3f8b-4ace-9b2a-081e21795a1f)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes. League of Legends is a trademark of Riot Games, Inc.

## 🔮 Future Enhancements

- **Live Game Tracking**: Real-time match tracking
- **Champion Statistics**: Detailed champion performance analytics
- **Rank Tracking**: LP tracking and rank progression
- **Social Features**: Friend lists and match sharing
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Machine learning-powered insights


