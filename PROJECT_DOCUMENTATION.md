# 🏥 MedRemind - Full Stack Healthcare System

MedRemind is a production-ready, role-based medicine reminder and tracking application. It is designed to bridge the gap between patients, their families, and medical professionals through three distinct, high-fidelity interfaces.

## 🌟 Core Philosophy
- **Patient Dashboard**: "What should I take now?" (Action-Oriented)
- **Caregiver Dashboard**: "Did they take it?" (Monitoring-Oriented)
- **Doctor Dashboard**: "How is treatment going?" (Data-Oriented)

---

## 🛠️ Tech Stack
- **Frontend**: Vanilla JS, HTML5, CSS3 (Tailwind CSS via CDN)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control
- **Analytics**: Chart.js
- **Icons**: Lucide Icons

---

## 🔑 Demo Credentials
| Role | Email | Password |
|---|---|---|
| 🧑‍🦳 **Patient** | `patient@example.com` | `password123` |
| 👨‍👩‍👧 **Caregiver** | `caregiver@example.com` | `password123` |
| 🧑‍⚕️ **Doctor** | `doctor@example.com` | `password123` |

---

## 🚀 Key Features

### 1. Patient Experience
- **Smart Next Dose**: Prominent card highlighting the very next medicine to be taken with a countdown.
- **One-Tap Logging**: Massive "I Took It" and "Skip" buttons for elderly-friendly interaction.
- **Adherence Progress**: Daily status bar (e.g., "3/5 Taken") to motivate the user.
- **History View**: Detailed timeline of all past actions with the ability to "undo" incorrect logs.

### 2. Caregiver Experience
- **Live Status Monitoring**: Instant alerts if a linked patient misses a dose.
- **Adherence Analytics**: Dynamic bar charts showing the patient's performance over the last 7 days.
- **Patient Linking**: Ability to add multiple patients to a caregiver's account via email lookup.
- **Quick Actions**: Direct "Call" and "Send Notification" buttons.

### 3. Doctor/Admin Experience
- **Clinic Metrics**: Overview of total patients, clinic-wide adherence rate, and high-risk alerts.
- **Patient Directory**: Searchable management table with current medical status.
- **Prescription Creation**: Ability for doctors to remotely add medicines, dosages, and schedules to any patient's profile.

---

## 📂 Project Structure
```text
/backend
  ├── config/db.js           (MongoDB Connection)
  ├── middleware/auth.js     (JWT Role Protection)
  ├── models/                (User, Medicine, Log Schemas)
  ├── routes/                (Auth, Medicines, Logs, Users API)
  ├── server.js              (Entry Point)
  └── seed.js                (Demo Data Generator)

/frontend
  ├── index.html             (Login/Entry)
  ├── dashboard.html         (Dynamic Role-Based Hub)
  ├── medicines.html         (Patient Med Management)
  ├── history.html           (Adherence Timeline)
  ├── css/style.css          (Custom UI Tweaks)
  └── js/
      ├── api.js             (Fetch Interceptor)
      ├── auth.js            (Session Management)
      └── dashboard.js       (Role-Specific Logic)
```

---

## 🔒 Security & Privacy
- **Encrypted Storage**: All passwords are hashed using `bcryptjs`.
- **JWT Protection**: API routes are protected; users can only see data they own or have explicit permission for (e.g., linked patients).
- **Elderly-Friendly Design**: High-contrast colors, large touch targets (min 48px), and minimalist navigation.

---

## 📈 Future Scalability
- **PWA Support**: Can be converted to a Progressive Web App for offline logging.
- **SMS Integration**: Backend is ready for Twilio/Firebase integration for SMS alerts.
- **AI Optimization**: Data structure supports future AI implementation to predict missed dose patterns.

---

*Developed with care for better health adherence.*
