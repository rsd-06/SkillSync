import './globals.css';
import { Toaster } from 'react-hot-toast';
import Hydrator from '../components/Hydrator';

export const metadata = {
  title: 'SkillSync — Collaborate by Skill',
  description: 'Find teammates, post ideas, and build projects at KCT.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
        <Hydrator />
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'text-sm font-medium',
            style: { borderRadius: '10px', padding: '12px 16px' },
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
