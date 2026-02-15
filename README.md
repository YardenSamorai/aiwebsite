# AI Video Production Website

A modern, professional landing page for AI video production services with a comprehensive admin panel for content management.

## ✨ Features

- 🎨 **Modern Landing Page** - Professional, responsive design
- 🔐 **Admin Panel** - Full content management system
- 🎬 **Portfolio Gallery** - YouTube video integration
- 📝 **Dynamic Content** - Edit, add, and remove all sections
- 🔒 **Secure Authentication** - Password-protected admin access
- 📱 **Fully Responsive** - Works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YardenSamorai/AI-website.git
cd AI-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_ADMIN_PASSWORD=YourSecurePasswordHere
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5005`

## 🔐 Admin Panel

Access the admin panel at: `http://localhost:5005/admin`

### What You Can Edit

- **Hero Section** - Main title, subtitle, and CTAs
- **Navigation** - Brand name and WhatsApp links
- **Benefits** - Add, edit, or remove benefit cards
- **Services** - Manage service offerings
- **Process Steps** - Edit workflow steps
- **Portfolio** - Add/edit/remove YouTube videos
- **Testimonials** - Manage customer reviews
- **FAQs** - Edit frequently asked questions
- **Contact Info** - Update contact details
- **Section Headers** - Customize all section titles

Changes are saved to localStorage and reflected immediately on the main site.

## 📁 Project Structure

```
AI-website/
├── public/
│   ├── site-data.json      # Main content data file
│   └── videos/             # Video assets (optional)
├── src/
│   ├── App.tsx             # Main website component
│   ├── Admin.tsx           # Admin panel component
│   └── index.tsx           # Entry point
├── .env                    # Environment variables (not in Git)
├── .env.example            # Environment template
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 5005)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- Admin password stored in `.env` (not committed to Git)
- `.env` file is in `.gitignore`
- Password never appears in console or source code
- Change default password before production deployment

## 🌐 Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Ensure `.env` file is configured on the server with correct values

## 🛡️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ADMIN_PASSWORD` | Admin panel password | Yes |
| `GEMINI_API_KEY` | Gemini API key | Optional |

## 📚 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📝 License

All rights reserved © 2024

## 🤝 Contributing

This is a private project. For issues or questions, please open an issue on GitHub.

---

Made with ❤️ using AI
