// Firebase services
import { auth, db } from "../firebase/firebase-config.js";

// Firebase Auth
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// Firebase Firestore
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    query,
    where,
    updateDoc,
    onSnapshot,
    orderBy,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";


export async function loginUser(email, password) {
    try {
        console.log("Attempting login for:", email);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        console.log("Auth successful, fetching role for UID:", cred.user.uid);
        const role = await getUserRole(cred.user.uid);
        console.log("User role detected:", role);

        if (role === "incharge") {
            window.location.href = "incharge.html";
        } else if (role === "officer") {
            window.location.href = "officer.html";
        } else {
            console.warn("User has no role assigned. Redirecting to profile selection.");
            window.location.href = "choose-profile.html";
        }
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}


// ===============================
// REGISTER (stores role in users collection)
// ===============================
export async function registerUser(name, email, password, role) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    try {
        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            role,
            isActive: role === "officer" ? false : null,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Firestore Error in registerUser:", error);
        if (error.code === 'permission-denied') {
            throw new Error("Missing or insufficient permissions in Firestore. Please update your security rules.");
        }
        throw error;
    }

    if (role === "incharge") {
        window.location.href = "incharge.html";
    } else if (role === "officer") {
        window.location.href = "officer.html";
    }
}


// ===============================
// LOGOUT
// ===============================
export async function logoutUser() {
    await signOut(auth);
    window.location.href = "login.html";
}


// ===============================
// AUTH GUARD (redirects if not logged in)
// ===============================
export function protectPage(allowedRole) {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "login.html";
                return;
            }
            const role = await getUserRole(user.uid);
            if (allowedRole && role !== allowedRole) {
                window.location.href = "choose-profile.html";
                return;
            }
            resolve(user);
        });
    });
}


// ===============================
// GET USER DATA
// ===============================
export async function getUserRole(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        return userDoc.exists() ? userDoc.data().role : null;
    } catch (error) {
        console.error("Firestore Error in getUserRole:", error);
        if (error.code === 'permission-denied') {
            throw new Error("Cannot read user role: Permission denied. Check Firestore security rules.");
        }
        throw error;
    }
}

export async function getUserData(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
}


// ===============================
// ALERTS — Create (from emergency vehicle page)
// ===============================
export async function createAlert(alertData) {
    const ref = await addDoc(collection(db, "alerts"), {
        ...alertData,
        status: "pending",
        // Initial location is the departure point
        location: alertData.fromLocation || null,
        assignedOfficerId: null,
        assignedOfficerName: null,
        createdAt: serverTimestamp(),
        assignedAt: null,
        clearedAt: null
    });
    return ref.id;
}

export async function updateAlertLocation(alertId, latitude, longitude) {
    await updateDoc(doc(db, "alerts", alertId), {
        location: { latitude, longitude, updatedAt: serverTimestamp() }
    });
}


// ===============================
// ALERTS — Real-time listener for all non-cleared
// Used by Incharge dashboard
// ===============================
export function listenAlerts(callback) {
    const q = query(
        collection(db, "alerts"),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
        const alerts = [];
        snapshot.forEach(doc => {
            alerts.push({ id: doc.id, ...doc.data() });
        });
        callback(alerts);
    });
}


// ===============================
// ALERTS — Listen to a single alert by ID (for driver status)
// ===============================
export function listenAlertById(alertId, callback) {
    return onSnapshot(doc(db, "alerts", alertId), (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() });
        }
    });
}


// ===============================
// ALERTS — Assign to officer (used by Incharge)
// ===============================
export async function assignAlert(alertId, officerId, officerName) {
    await updateDoc(doc(db, "alerts", alertId), {
        status: "assigned",
        assignedOfficerId: officerId,
        assignedOfficerName: officerName,
        assignedAt: serverTimestamp()
    });
}


// ===============================
// ALERTS — Update status (used by Officer)
// ===============================
export async function updateAlertStatus(alertId, status) {
    const updates = { status };
    if (status === "cleared") {
        updates.clearedAt = serverTimestamp();
    }
    await updateDoc(doc(db, "alerts", alertId), updates);
}


// ===============================
// ALERTS — Listen to officer's assigned alerts
// ===============================
export function listenOfficerAlerts(officerId, callback) {
    const q = query(
        collection(db, "alerts"),
        where("assignedOfficerId", "==", officerId)
    );
    return onSnapshot(q, (snapshot) => {
        const alerts = [];
        snapshot.forEach(doc => {
            alerts.push({ id: doc.id, ...doc.data() });
        });
        callback(alerts);
    });
}


// ===============================
// OFFICERS — Get active officers (for Incharge assignment)
// ===============================
export function listenActiveOfficers(callback) {
    const q = query(
        collection(db, "users"),
        where("role", "==", "officer")
    );
    return onSnapshot(q, (snapshot) => {
        const officers = [];
        snapshot.forEach(doc => {
            officers.push({ id: doc.id, ...doc.data() });
        });
        callback(officers);
    });
}


// ===============================
// OFFICER — Toggle active/inactive status
// ===============================
export async function toggleOfficerStatus(uid, isActive) {
    await updateDoc(doc(db, "users", uid), { isActive });
}

export async function updateOfficerLocation(uid, latitude, longitude) {
    await updateDoc(doc(db, "users", uid), {
        location: { latitude, longitude, updatedAt: serverTimestamp() }
    });
}

// Re-export for pages that need it
export { auth, db, onAuthStateChanged };