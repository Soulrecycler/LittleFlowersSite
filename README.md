# Little Flowers Playschool & Kindergarten

A premium, minimal scrollytelling web experience for parents to explore the philosophy, programs, and community of Little Flowers Playschool.

## ✨ Features

- **Interactive Scrollytelling**: A smooth, cinematic scroll experience that guides parents through our school's vision, curriculum, and trust factors.
- **Micro-Animations**: Purposeful, non-distracting animations driven by scroll progress to maintain engagement.
- **Community Reviews**: A real-time review system where parents can share their stories, powered by Firebase.
- **Responsive Design**: Fully optimized for mobile-first users, ensuring a great experience on any device.
- **Premium Aesthetics**: A soft, child-friendly color palette with modern typography and high-end imagery.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State & DB**: [Firebase](https://firebase.google.com/) (Firestore & Auth)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & Custom Scroll Logic
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Soulrecycler/LittleFlowersSite.git
   cd LittleFlowersSite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is private and intended for Little Flowers Playschool & Kindergarten.
