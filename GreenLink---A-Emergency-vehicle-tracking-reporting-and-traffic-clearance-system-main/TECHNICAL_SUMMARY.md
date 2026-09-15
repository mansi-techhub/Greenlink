# GreenLink Technical Summary 🚨

GreenLink is a real-time **Emergency Vehicle Priority System** designed to streamline communication and coordination between emergency vehicle drivers, traffic control incharge staff, and on-duty field officers to ensure rapid road clearance.

---

## 🛠️ Technology Stack

| Component | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, ES6 JavaScript | Fully responsive, vanilla CSS glassmorphic interface with custom variables, smooth transitions, and viewport-aware layouts. |
| **Backend/Database** | Google Firebase | Client-side integration using Firebase Web SDK (v12.9.0):<br>• **Firebase Authentication**: For secure, email-based staff sign-ins.<br>• **Cloud Firestore**: Real-time database syncing alerts and user statuses. |
| **Mapping & Location** | Leaflet.js | Open-source interactive map library used to render live locations of emergency vehicles and officers in real time. |
| **Visual Effects** | Custom Canvas | Lightweight background particle engine (`js/particles.js`) for premium ambient styling. |
| **Typography** | Google Fonts | Inter for clean, legible interface text; JetBrains Mono for system codes. |

---

## 🏗️ System Architecture & Process Flow

GreenLink is structured around three distinct modules, each aligned with a specific operational role in the emergency pipeline:

```
[Emergency Vehicle]                 [Traffic Incharge]                [Traffic Officer]
 (driver.html)                       (incharge.html)                   (officer.html)
       │                                    │                                 │
       ├────── Create Alert (Pending) ─────>│                                 │
       │                                    ├────── Assigns Officer ─────────>│
       │<──────── Update: Assigned ─────────┤                                 │
       │                                    │                                 ├─ Toggle Active/Duty
       │                                    │<───── Update: Clearing ─────────┤
       │<──────── Update: Clearing ─────────┤                                 │
       │                                    │                                 ├─ Complete Task
       │                                    │<───── Update: Cleared ──────────┤
       │<──────── Update: Cleared ──────────┤                                 │
```

### 1. Emergency Vehicle Driver Module (`driver.html`)
* **Access**: Public (no login required for rapid submission in high-stress scenarios).
* **Functionality**:
  * Quick-departure form (vehicle type, license number, contact details, start/end locations, and priority scale).
  * Auto-submits vehicle's location coordinates.
  * Real-time listener watches the status pipeline: `Pending ➔ Assigned ➔ Clearing ➔ Cleared`.

### 2. Traffic Incharge Command Dashboard (`incharge.html`)
* **Access**: Restricted (requires staff credentials).
* **Functionality**:
  * Real-time incident console showing active emergency alerts.
  * Active officer directory tracking field personnel availability (`Active` vs. `On-Duty` status).
  * One-click duty assignments pairing live incidents with the closest available officers.
  * Multi-marker Leaflet map displaying live GPS feeds of active alerts and officers.

### 3. Traffic Police Officer Mobile Console (`officer.html`)
* **Access**: Restricted (requires staff credentials).
* **Functionality**:
  * "On-Duty" toggle which signals availability to the Incharge console.
  * Duty panel listing assigned alerts with route instructions.
  * Clear action buttons (`Mark Clearing`, `Mark Cleared`) that feed live updates back to the driver's screen.
  * Background GPS tracking updating coordinates on the database.

---

## 🗄️ Database Architecture (Cloud Firestore)

The system manages data across two main collections in Cloud Firestore:

### 1. `users` Collection
Tracks staff registration profiles, authentication roles, and live statuses.
```json
{
  "name": "Mansi Sarote",
  "email": "mansi@greenlink.org",
  "role": "officer",                // "incharge" or "officer"
  "isActive": true,                 // Duty toggle status (officers only)
  "location": {                     // Live GPS coordinate updates
    "latitude": 19.0760,
    "longitude": 72.8777,
    "updatedAt": "Timestamp"
  },
  "createdAt": "Timestamp"
}
```

### 2. `alerts` Collection
Tracks emergency events, routes, statuses, and field responses.
```json
{
  "driverName": "Vanita Joshi",
  "driverPhone": "9087906543",
  "vehicleNumber": "MH 20 CP 1234",
  "vehicleType": "ambulance",       // "ambulance", "fire-brigade", "police"
  "priority": "high",               // "high", "critical", "medium"
  "route": "CityCare Hospital -> MGM Hospital",
  "status": "cleared",              // "pending", "assigned", "clearing", "cleared"
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777,
    "updatedAt": "Timestamp"
  },
  "assignedOfficerId": "xj8paR40zFNXxjNRnFqh4z9nBrC3",
  "assignedOfficerName": "Mansi Sarote",
  "createdAt": "Timestamp",
  "assignedAt": "Timestamp",
  "clearedAt": "Timestamp"
}
```

---

## 🔐 Security & Access Control (`firestore.rules`)

To prevent unauthorized access, Firestore database access is governed by the following ruleset:

* **Users profiles (`/users/{userId}`)**:
  * **Read**: Any authenticated user can read profile details (needed for the Incharge to check active officers).
  * **Write**: Restricted strictly to the owner (`request.auth.uid == userId`) to prevent profile tampering.
* **Alerts pipeline (`/alerts/{alertId}`)**:
  * **Read & Create**: Open to everyone. This permits emergency vehicle drivers to file priority alerts without a login hurdle.
  * **Update**: Allowed only for authenticated staff members (Incharges and Officers) to process and clear alerts.


---

## 🚀 Running the Project Locally

A local web server is currently configured and running for this workspace:

* **URL**: [http://localhost:5000](http://localhost:5000)
* **Status**: **Running in Background**

If you need to start a server manually in the future, navigate to the project directory and run one of these lightweight servers:

### Option A: Python (Pre-installed)
```bash
python -m http.server 5000
```

### Option B: Node.js (Pre-installed)
```bash
npx http-server -p 5000
```

---


