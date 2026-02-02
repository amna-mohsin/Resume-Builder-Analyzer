# ResumeAI+ - Resume Builder

A modern, feature-rich resume builder application built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**.

## 🎯 Features

### Resume Creation & Editing
- **Multiple Resume Formats**: Create and manage multiple resumes
- **Live Preview**: See your resume in real-time as you edit
- **Customizable Themes**: Choose from multiple color themes
- **Drag & Drop Sections**: Reorder sections to your preference
- **Rich Text Editor**: Add descriptions with bullet points

### Download & Export
- **PDF Export**: Download resumes in professional black & white PDF format
- **Direct Download**: Resumes download directly to your computer
- **Auto-Save**: Downloaded resumes automatically save to your dashboard

### Dashboard
- **Resume Management**: View, edit, and delete all your saved resumes
- **Quick Stats**: Track total resumes and completion status
- **Easy Navigation**: + New Resume button for quick access
- **Three-Dot Menu**: Edit, view, or delete resumes with one click

### User Profile
- **Auto-Login**: Username automatically updates from Supabase profile on login
- **Profile Management**: Edit name, phone, and bio
- **Data Persistence**: All profile data saved securely in Supabase database

### Navigation
- **Back Button**: Safely return to dashboard from resume editor with confirmation dialog
- **Sidebar Navigation**: Easy access to Dashboard, Resume Builder, and Profile
- **Responsive Design**: Works seamlessly on desktop and tablet

## 📋 Resume Sections

- **Personal Information**: Name, email, phone, LinkedIn, GitHub
- **Professional Summary**: Write about your professional background
- **Work Experience**: Add companies, roles, dates, and descriptions
- **Education**: Schools, degrees, and graduation dates
- **Projects**: Showcase key projects with links and descriptions
- **Skills**: Rate your proficiency level (1-5 stars)
- **Languages**: List languages and proficiency levels

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🗄 Project Structure

```
src/
├── components/
│   ├── Auth/              # Login & Signup components
│   ├── Layout/            # Header, Sidebar, Footer
│   └── Resume/            # Resume-related components
├── pages/
│   ├── Dashboard.jsx      # Main dashboard
│   ├── ResumeEditor.jsx   # Resume builder
│   ├── Profile.jsx        # User profile
│   ├── AddResume.jsx      # Add resume page
│   ├── ViewResume.jsx     # View resume page
│   └── ThemeSelection.jsx # Theme picker
├── utils/
│   ├── supabaseClient.js  # Supabase config & helpers
│   └── helpers.js         # Utility functions
├── App.jsx                # Main app component
└── index.css              # Global styles
```

## 🔐 Authentication & Database

### Supabase Integration
- **Authentication**: Email/password authentication via Supabase Auth
- **Database**: PostgreSQL database for storing user profiles
- **Row Level Security**: Secure data access with RLS policies

### Profile Table
The app uses a `profile` table in Supabase with the following fields:
- `user_id` - User's unique ID
- `full_name` - User's full name
- `email` - User's email address
- `phone` - User's phone number
- `bio` - User's biography/about section
- `created_at` - Account creation date
- `updated_at` - Last update timestamp

## 📦 Key Dependencies

- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Supabase**: Backend as a service (Auth + Database)
- **html2canvas**: Convert HTML to canvas/images
- **jsPDF**: Generate PDF documents
- **Lucide React**: Beautiful icon library

## 🎨 Design

- **Modern UI**: Clean, minimalist design with rounded corners
- **Color Scheme**: Blue, purple, and gray palette
- **Responsive**: Mobile-friendly layout
- **Accessible**: WCAG compliant components

## 📱 How to Use

### Create a New Resume
1. Click **+ New Resume** button on Dashboard
2. Select a theme color
3. Fill in your personal information
4. Add sections (work, education, projects, skills, languages)
5. Preview changes in real-time on the right side

### Download Resume
1. Click **EXPORT PDF** button
2. Enter your desired filename
3. Click **Download PDF**
4. PDF downloads in black & white format to your Downloads folder
5. Resume automatically saves to dashboard

### Manage Resumes
- Click the three-dot menu (⋮) next to any resume
- Choose **View** to see read-only preview
- Choose **Edit** to modify the resume
- Choose **Delete** to remove from dashboard

### Update Profile
1. Click your profile picture in the top-right corner
2. Click **My Profile**
3. Click **Edit Profile**
4. Update name, phone, and bio
5. Click **Save**

## 🌐 Deployment

Build for production:
```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 🐛 Troubleshooting

### PDF Won't Download
- Ensure your browser allows downloads
- Check that pop-ups aren't blocked
- Try a different browser if issues persist

### Profile Data Not Updating
- Ensure Supabase profile table is created in your database
- Check that you have proper RLS policies enabled
- Verify Supabase credentials are correct

### Resume Won't Save to Dashboard
- Check browser's localStorage is enabled
- Ensure sufficient storage space available
- Try clearing cache if experiencing issues

## 📞 Support

For issues or feature requests, please contact the development team.

## 📄 License

This project is proprietary and confidential.
