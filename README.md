# HebrewGPT - העוזר האישי שלך בעברית 🤖

אפליקציית צ'אט חכמה המותאמת במיוחד לדוברי עברית, עם תמיכה מלאה ב-RTL וממשק משתמש מודרני.

HebrewGPT is a sophisticated chat application designed specifically for Hebrew speakers, leveraging advanced AI models to provide intelligent, context-aware conversations in Hebrew. The app features a modern, RTL-optimized interface and works on both web and mobile platforms.

## ✨ תכונות עיקריות | Features

### 🎯 זמין כעת | Currently Available
- ✅ ממשק משתמש מלא בעברית עם תמיכה ב-RTL
- ✅ מסך הגדרות לבחירת מודל וניהול העדפות
- ✅ תמיכה בהקלטת קול והמרה לטקסט
- ✅ תצוגת צ'אט מודרנית עם בועות צ'אט
- ✅ מסך פתיחה אינטראקטיבי עם פעולות מהירות
- ✅ תמיכה בשמירת היסטוריית שיחות
- ✅ תמיכה בשמירת שיחות מועדפות
- ✅ תפריט צד נגיש עם ניווט קל
- ✅ תמיכה בתצוגת יום/לילה
- ✅ תזמורת סוכנים (Agent Orchestra) - ניהול סוכנים חכמים
- ✅ אינטגרציה עם מודלים מתקדמים:
  - GPT-4o
  - GPT-4o-mini
  - o1-preview
  - o1-mini

### 🚀 בפיתוח | In Development
- 🔄 אינטגרציה עם Claude ומודלים נוספים
- 🔄 השלמת תכונות תזמורת הסוכנים:
  - יצירת סוכנים מותאמים אישית
  - הגדרת תפקידים וכללים
  - תיאום בין סוכנים
  - ניהול משימות מורכבות
- 🔄 אופטימיזציה מתקדמת לעברית:
  - הגדרת הוראות התחלתיות מותאמות
  - שיפור הבנת הקשר בעברית
  - תמיכה בניבים ומטבעות לשון

### 📅 מתוכנן לעתיד | Planned
- 📱 תמיכה במצב אופליין
- 🎨 יצירת תמונות באמצעות AI
- 🎵 המרת טקסט לדיבור בעברית
- 📊 ויזואליזציה של נתונים
- 🔍 חיפוש מתקדם בהיסטוריית שיחות
- 📤 ייצוא שיחות בפורמטים שונים
- 🔐 אבטחה מתקדמת והצפנת נתונים

## 🛠️ Tech Stack

### Core Technologies
- React Native (Expo)
- TypeScript
- OpenAI API
- Anthropic Claude API (coming soon)
- React Navigation
- AsyncStorage
- Expo Vector Icons
- React Native Reanimated
- React Native Gesture Handler
- Web Speech API (web platform)

### Platform Support
- Web browsers (Chrome, Safari, Firefox)
- iOS 13+
- Android 8+
- Responsive design for all screen sizes

### Development Tools
- Expo CLI
- TypeScript
- ESLint
- Prettier
- Jest for testing

## 📦 Project Structure
```
HebrewGPT/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── ChatInput/       # Chat input components
│   │   ├── VoiceRecorder/   # Voice recording functionality
│   │   └── WelcomePrompt/   # Welcome screen components
│   ├── screens/       # Screen components
│   │   ├── ChatScreen/      # Main chat interface
│   │   ├── SettingsScreen/  # App settings
│   │   └── AgentOrchestra/  # Agent management
│   ├── navigation/    # Navigation configuration
│   ├── context/      # React Context providers
│   │   ├── ChatContext/     # Chat state management
│   │   └── ThemeContext/    # Theme management
│   ├── config/       # Configuration files
│   ├── services/     # Platform-specific services
│   ├── types/        # TypeScript definitions
│   └── utils/        # Utility functions
├── App.tsx           # Root component
└── app.json         # Expo configuration
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- OpenAI API key

### Setup Steps
1. Clone the repository:
```bash
git clone https://github.com/yourusername/HebrewGPT.git
cd HebrewGPT
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add your API keys:
```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key_here
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_claude_key_here
```

4. Start the development server:
```bash
npx expo start
```

## 🔒 Security Notes
- API keys should be handled server-side in production
- Current web implementation is for development only
- Consider implementing a backend service for production
- Implement proper authentication and data encryption

## 🌐 Localization
- Primary: Hebrew (RTL)
- Secondary: English
- Future: Arabic, Russian

## 🤝 תרומה לפרויקט | Contributing

נשמח לקבל תרומות ורעיונות לשיפור! אנא צרו issue או שלחו pull request.

We welcome contributions! Please create an issue or submit a pull request.

### Contributing Guidelines
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 רישיון | License

MIT License - See LICENSE file for details.
