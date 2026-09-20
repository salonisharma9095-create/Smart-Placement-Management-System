# 🎓 Smart Placement Management System

A full-stack MERN application that connects students, placement coordinators, and recruiters on a single platform — streamlining the entire campus placement and hiring process.

## 🚀 Features

### For Students
- Secure registration/login with JWT authentication
- Profile management with skills, branch, CGPA, graduation year
- Resume upload (PDF)
- Browse companies with real-time eligibility checking (CGPA + branch based)
- Skill-based match scoring — companies ranked by how well they match the student's skills
- Apply to companies with duplicate-application prevention
- Track application status (Applied → Shortlisted → Interview → Selected/Rejected)
- Placement Readiness Score — a rule-based score showing profile completeness

### For Recruiters
- Self-service registration and dashboard
- Post, edit, and delete job listings
- Listings go live only after admin approval (approval workflow)
- Track status of own postings (Pending / Approved / Rejected)

### For Admins
- Add, edit, and delete company listings directly (auto-approved)
- Review and approve/reject recruiter-submitted job postings
- View all student applications with full context
- Update application status
- Dashboard with key statistics (companies, applications, students, selections)

### Smart Features (Rule-Based, No External AI APIs)
- Automatic eligibility checking based on CGPA and branch
- Skill-match percentage and automatic ranking of companies
- Search and filter companies by name, role, and branch
- Placement Readiness Score based on profile completeness

## 🛠️ Tech Stack

**Frontend:** React.js, Vite, React Router, Axios, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose ODM)
**Authentication:** JWT, bcryptjs
**File Uploads:** Multer
**Tools:** Postman/Thunder Client, Git, VS Code

## 📁 Project Structure
smart-placement-manager/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── context/
│ ├── styles/
│ └── utils/
├── server/ # Node/Express backend
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── uploads/
└── README.md


## ⚙️ Setup Instructions

### Backend Setup
```bash
cd server
npm install
# Create a .env file with PORT, MONGO_URI, JWT_SECRET
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 👥 User Roles

| Role | Access |
|------|--------|
| Student | Browse jobs, apply, track applications, manage profile & resume |
| Recruiter | Post jobs (pending admin approval), manage own postings |
| Admin | Full company management, approve/reject postings, manage all applications |

## 🔑 Key Technical Decisions

- Role-based access control using JWT middleware — enforced at both route (backend) and UI (frontend) level
- Approval workflow for recruiter-submitted jobs
- Database-level unique index prevents duplicate applications
- Rule-based smart features instead of external AI APIs
- Password hashing with bcryptjs
- File uploads handled with Multer, with validation and size limits

## 👤 Author

Built by Saloni Sharma as a full-stack portfolio project.