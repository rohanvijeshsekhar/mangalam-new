# Mangalam Travels - Node.js Backend

A full-stack travel & tours website with a Node.js/Express backend, in-memory SQLite data store, and a comprehensive admin panel.

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: SQLite (via better-sqlite3) with In-Memory Store
- **Views**: EJS Templates
- **Admin Panel**: jQuery + Barba.js SPA
- **Styling**: Tailwind CSS (CDN)

## Project Structure
```
public_html2/
├── backend/         # Node.js Express server
│   ├── src/
│   │   ├── controllers/   # Admin & public controllers
│   │   ├── data/          # SQLite DB + in-memory store
│   │   ├── routes/        # API & page routes
│   │   └── views/         # EJS templates
│   ├── uploads/           # Uploaded media files
│   └── package.json
├── admin/           # Admin panel HTML/JS/CSS
│   ├── src/app.js   # Admin SPA logic
│   └── *.html       # Admin pages
└── assets/          # Frontend static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
cd backend
npm install
npm start
```

Server runs at: `http://localhost:3000`
Admin Panel: `http://localhost:3000/admin/`

## Features
- **Destinations** CRUD with images
- **Packages** (Holiday Packages) CRUD
- **Activities** CRUD
- **Attraction Tickets** CRUD
- **Blogs** with rich text editor
- **Enquiry Management** (Cart + Contact)
- **Testimonials, Partners, Posters**
- **In-memory + SQLite hybrid storage**

## Deployment
- Configured for Hostinger Shared Hosting (`public_html/`)
- Node.js backend with PM2 process management recommended

## License
Private - Mangalam Travel & Tours © 2026
