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
