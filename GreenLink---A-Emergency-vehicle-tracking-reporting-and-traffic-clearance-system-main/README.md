# GreenLink 🚨
GreenLink is an Emergency Vehicle Priority System for Real-time coordination between emergency vehicles, traffic incharge, and on-duty officers.

---

## 🔄 Process Flow

```
Emergency Vehicle reports departure (driver.html)
         ↓
Traffic Incharge sees alert on dashboard (incharge.html)
         ↓
Incharge assigns clearance to an ACTIVE on-duty officer
         ↓
On-duty officer clears the road (officer.html)
         ↓
Driver sees live status: Pending → Assigned → Clearing → Cleared
```

## 👤 User Roles

| Role | Login? | Module |
|------|--------|--------|
| Emergency Vehicle Driver | ❌ No | `driver.html` — Quick departure form |
| Traffic Incharge | ✅ Yes | `incharge.html` — Alert dashboard + officer assignment |
| Traffic Police Officer | ✅ Yes | `officer.html` — Duty toggle + clearance management |

## 🧠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6)
- **Backend:** Firebase Authentication + Firestore (real-time `onSnapshot`)
- **Fonts:** Inter, JetBrains Mono

## 🌐 Deploy and Share

This project is a static website and is configured to deploy automatically to GitHub Pages.

1. Push the repository to GitHub on the `main` branch.
2. Open **Settings → Pages** in the GitHub repository.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the completed **Deploy GreenLink to GitHub Pages** workflow.

The recruiter-facing link is:

### [🚨 Open the GreenLink live demo](https://mansi-techhub.github.io/Greenlink/)

Every future push to `main` will update the same link automatically. The landing page is the best link to share because it lets a recruiter explore the driver, incharge, and officer modules.

## 📁 File Structure

```
├── index.html           # Welcome splash
├── choose-profile.html  # Role picker (3 cards)
├── driver.html          # Emergency departure form + live status
├── incharge.html        # Incharge dashboard (alerts + officers)
├── officer.html         # Officer dashboard (duty toggle + assignments)
├── login.html           # Staff login (role-based redirect)
├── register.html        # Staff registration (Incharge/Officer)
├── firebase/            # Firebase config
├── js/auth.js           # All Firestore CRUD + real-time listeners
└── js/                  # Theme, transitions
```
