# choloJai - Travel Booking Website

## What is this project?

**choloJai** is a travel booking website that helps people find and book travel packages. Built with Next.js, it offers:

- **Travel Quiz**: Users take a 3-step quiz to get personalized travel recommendations
- **AI Chatbot**: Smart assistant that answers travel questions and helps with bookings  
- **Package Browsing**: View detailed travel packages for Bangladesh (Sajek, Cox's Bazar) and international destinations (Bangkok, Dubai)
- **Direct Booking**: WhatsApp integration for easy booking and customer support
- **Mobile Responsive**: Works perfectly on phones, tablets, and desktops

The website helps travelers discover destinations that match their budget and preferences, then book directly through WhatsApp.

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm

### Quick Start

1. **Clone the project**
```bash
git clone https://github.com/istiaq13/cholojai.git
cd cholojai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` file:
```bash
OPENAI_API_KEY= your_openai_api_key_here          # Optional: For AI chatbot
NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER= +8801XXXXXXXXX  # Required: For bookings
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
Go to [http://localhost:3000](http://localhost:3000)

## Code Structure & What Each Part Does

```
cholojai/
├── app/                          # Main application pages
│   ├── page.tsx                  # Homepage with hero section
│   ├── api/chat/route.ts         # AI chatbot backend API
│   ├── itinerary/[id]/          # Individual package detail pages
│   └── result/page.tsx          # Quiz results page
│
├── components/                   # Reusable UI pieces
│   ├── hero-section.tsx         # Homepage banner with "Find My Trip" button
│   ├── quiz-popup.tsx           # 3-step travel quiz modal
│   ├── chatbot-ui.tsx           # Chat interface with AI assistant
│   ├── chatbot-float.tsx        # Floating chat button
│   ├── animated-hero-cards.tsx  # Destination cards on homepage
│   └── header.tsx               # Top navigation menu
│
├── data/
│   └── packages.json            # All travel packages, destinations, and FAQs
│
├── contexts/
│   └── QuizContext.tsx          # Manages quiz state across components
│
└── public/                      # Images and static files
    ├── sajek.jpg               # Destination photos
    ├── bangkok.jpg
    └── image-bg.jpg            # Homepage background
```

### Key Files Explained

- **`data/packages.json`** - Contains all travel packages, prices, itineraries, and FAQ data
- **`app/api/chat/route.ts`** - Powers the AI chatbot using OpenAI
- **`components/quiz-popup.tsx`** - The travel quiz that recommends packages
- **`components/chatbot-ui.tsx`** - Main chat interface with package cards
- **`app/result/page.tsx`** - Shows personalized package recommendations after quiz

### Build Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
```
