/*==================================================
LUNOVIA FIREBASE SERVICE
Version 2.0
==================================================*/

"use strict";

/*==================================================
FIREBASE CONFIGURATION
==================================================*/

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

/*==================================================
FIREBASE MANAGER
==================================================*/

const FirebaseManager = {

    app: null,
    auth: null,
    db: null,
    storage: null,

    initialized: false,

    async initialize() {

        if (this.initialized) {
            return true;
        }

        try {

            if (typeof firebase === "undefined") {
                console.error("Firebase SDK not loaded.");
                return false;
            }

            this.app = firebase.initializeApp(firebaseConfig);

            this.auth = firebase.auth();

            this.db = firebase.firestore();

            this.storage = firebase.storage();

            this.initialized = true;

            console.log("LUNOVIA Firebase initialized");

            return true;

        } catch (error) {

            console.error("Firebase Initialization Error:", error);

            return false;

        }

    },

    isReady() {
        return this.initialized;
    },

    getAuth() {
        return this.auth;
    },

    getDatabase() {
        return this.db;
    },

    getStorage() {
        return this.storage;
    }

};

window.FirebaseManager = FirebaseManager;

/*==================================================
AUTHENTICATION
==================================================*/

FirebaseManager.register = async function (name, email, password) {

    try {

        const result = await this.auth.createUserWithEmailAndPassword(
            email,
            password
        );

        await this.db.collection("users")
            .doc(result.user.uid)
            .set({

                uid: result.user.uid,

                name: name,

                email: email,

                role: "customer",

                createdAt: new Date().toISOString()

            });

        return result.user;

    } catch (error) {

        console.error(error);

        throw error;

    }

};

FirebaseManager.login = async function (email, password) {

    try {

        const result = await this.auth.signInWithEmailAndPassword(

            email,

            password

        );

        return result.user;

    } catch (error) {

        console.error(error);

        throw error;

    }

};

FirebaseManager.logout = async function () {

    try {

        await this.auth.signOut();

    } catch (error) {

        console.error(error);

    }

};

FirebaseManager.resetPassword = async function (email) {

    try {

        await this.auth.sendPasswordResetEmail(email);

    } catch (error) {

        console.error(error);

        throw error;

    }

};

FirebaseManager.onAuthChanged = function (callback) {

    return this.auth.onAuthStateChanged(callback);

};

FirebaseManager.getCurrentUser = function () {

    return this.auth.currentUser;

};

/*==================================================
FIRESTORE - PRODUCTS
==================================================*/

FirebaseManager.Products = {

    async getAll() {

        try {

            const snapshot = await FirebaseManager.db
                .collection("products")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        } catch (error) {

            console.error(error);
            return [];

        }

    },

    async get(productId) {

        try {

            const doc = await FirebaseManager.db
                .collection("products")
                .doc(productId)
                .get();

            if (!doc.exists) return null;

            return {
                id: doc.id,
                ...doc.data()
            };

        } catch (error) {

            console.error(error);
            return null;

        }

    },

    async add(product) {

        try {

            const ref = await FirebaseManager.db
                .collection("products")
                .add(product);

            return ref.id;

        } catch (error) {

            console.error(error);
            throw error;

        }

    },

    async update(productId, data) {

        try {

            await FirebaseManager.db
                .collection("products")
                .doc(productId)
                .update(data);

        } catch (error) {

            console.error(error);
            throw error;

        }

    },

    async remove(productId) {

        try {

            await FirebaseManager.db
                .collection("products")
                .doc(productId)
                .delete();

        } catch (error) {

            console.error(error);
            throw error;

        }

    }

};

/*==================================================
FIRESTORE - ORDERS
==================================================*/

FirebaseManager.Orders = {

    async getAll() {

        try {

            const snapshot = await FirebaseManager.db
                .collection("orders")
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        } catch (error) {

            console.error(error);
            return [];

        }

    },

    async get(orderId) {

        try {

            const doc = await FirebaseManager.db
                .collection("orders")
                .doc(orderId)
                .get();

            if (!doc.exists) return null;

            return {
                id: doc.id,
                ...doc.data()
            };

        } catch (error) {

            console.error(error);
            return null;

        }

    },

    async getByUser(userId) {

        try {

            const snapshot = await FirebaseManager.db
                .collection("orders")
                .where("userId", "==", userId)
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        } catch (error) {

            console.error(error);
            return [];

        }

    },

    async add(order) {

        try {

            const ref = await FirebaseManager.db
                .collection("orders")
                .add({

                    ...order,

                    createdAt: firebase.firestore.FieldValue.serverTimestamp()

                });

            return ref.id;

        } catch (error) {

            console.error(error);
            throw error;

        }

    },

    async updateStatus(orderId, status) {

        try {

            await FirebaseManager.db
                .collection("orders")
                .doc(orderId)
                .update({

                    status,

                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()

                });

        } catch (error) {

            console.error(error);
            throw error;

        }

    },

    async remove(orderId) {

        try {

            await FirebaseManager.db
                .collection("orders")
                .doc(orderId)
                .delete();

        } catch (error) {

            console.error(error);
            throw error;

        }

    }

};

/*==================================================
FIRESTORE - USERS
==================================================*/

FirebaseManager.Users = {

    async getAll() {

        try {

            const snapshot = await FirebaseManager.db
                .collection("users")
                .orderBy("createdAt", "desc")
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

        } catch (error) {

            console.error(error);

            return [];

        }

    },

    async get(userId) {

        try {

            const doc = await FirebaseManager.db
                .collection("users")
                .doc(userId)
                .get();

            if (!doc.exists) {

                return null;

            }

            return {

                id: doc.id,

                ...doc.data()

            };

        } catch (error) {

            console.error(error);

            return null;

        }

    },

    async update(userId, data) {

        try {

            await FirebaseManager.db
                .collection("users")
                .doc(userId)
                .update({

                    ...data,

                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()

                });

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }

    },

    async remove(userId) {

        try {

            await FirebaseManager.db
                .collection("users")
                .doc(userId)
                .delete();

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }

    },

    async setRole(userId, role) {

        try {

            await FirebaseManager.db
                .collection("users")
                .doc(userId)
                .update({

                    role,

                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()

                });

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }

    }

};

/*==================================================
FIREBASE STORAGE
==================================================*/

FirebaseManager.Storage = {

    async uploadProductImage(file, folder = "products") {

        try {

            const fileName =
                Date.now() + "_" + file.name;

            const storageRef =
                FirebaseManager.storage
                    .ref()
                    .child(`${folder}/${fileName}`);

            const snapshot =
                await storageRef.put(file);

            const downloadURL =
                await snapshot.ref.getDownloadURL();

            return {

                success: true,

                url: downloadURL,

                path: snapshot.ref.fullPath

            };

        } catch (error) {

            console.error(error);

            return {

                success: false,

                error

            };

        }

    },

    async deleteFile(path) {

        try {

            await FirebaseManager.storage
                .ref(path)
                .delete();

            return true;

        } catch (error) {

            console.error(error);

            return false;

        }

    },

    async getURL(path) {

        try {

            return await FirebaseManager.storage
                .ref(path)
                .getDownloadURL();

        } catch (error) {

            console.error(error);

            return null;

        }

    }

};

/*==================================================
GOOGLE AUTHENTICATION
==================================================*/

FirebaseManager.Google = {

    async login() {

        try {

            const provider = new firebase.auth.GoogleAuthProvider();

            provider.setCustomParameters({
                prompt: "select_account"
            });

            const result = await FirebaseManager.auth
                .signInWithPopup(provider);

            const user = result.user;

            const userRef = FirebaseManager.db
                .collection("users")
                .doc(user.uid);

            const doc = await userRef.get();

            if (!doc.exists) {

                await userRef.set({

                    uid: user.uid,

                    name: user.displayName || "",

                    email: user.email || "",

                    photo: user.photoURL || "",

                    role: "customer",

                    provider: "google",

                    createdAt: firebase.firestore.FieldValue.serverTimestamp()

                });

            }

            return {

                success: true,

                user

            };

        } catch (error) {

            console.error(error);

            return {

                success: false,

                error

            };

        }

    }

};

/*==================================================
PHONE AUTHENTICATION
==================================================*/

FirebaseManager.Phone = {

    recaptcha: null,

    initializeRecaptcha(containerId = "recaptcha-container") {

        try {

            if (this.recaptcha) {

                return this.recaptcha;

            }

            this.recaptcha = new firebase.auth.RecaptchaVerifier(

                containerId,

                {
                    size: "normal"
                }

            );

            return this.recaptcha;

        } catch (error) {

            console.error(error);

            return null;

        }

    },

    async sendCode(phoneNumber) {

        try {

            const verifier = this.initializeRecaptcha();

            const confirmation = await FirebaseManager.auth
                .signInWithPhoneNumber(

                    phoneNumber,

                    verifier

                );

            window.phoneConfirmationResult = confirmation;

            return {

                success: true

            };

        } catch (error) {

            console.error(error);

            return {

                success: false,

                error

            };

        }

    },

    async verifyCode(code) {

        try {

            if (!window.phoneConfirmationResult) {

                throw new Error("Verification session not found.");

            }

            const result =
                await window.phoneConfirmationResult.confirm(code);

            const user = result.user;

            const userRef = FirebaseManager.db
                .collection("users")
                .doc(user.uid);

            const doc = await userRef.get();

            if (!doc.exists) {

                await userRef.set({

                    uid: user.uid,

                    phone: user.phoneNumber,

                    role: "customer",

                    provider: "phone",

                    createdAt: firebase.firestore.FieldValue.serverTimestamp()

                });

            }

            return {

                success: true,

                user

            };

        } catch (error) {

            console.error(error);

            return {

                success: false,

                error

            };

        }

    }

};

/*==================================================
SESSION & ROLE MANAGEMENT
==================================================*/

FirebaseManager.Session = {

    currentUser: null,

    currentProfile: null,

    initialize() {

        FirebaseManager.auth.onAuthStateChanged(

            async (user) => {

                if (!user) {

                    this.currentUser = null;
                    this.currentProfile = null;

                    window.dispatchEvent(
                        new CustomEvent("lunovia:logout")
                    );

                    return;

                }

                this.currentUser = user;

                try {

                    const doc = await FirebaseManager.db
                        .collection("users")
                        .doc(user.uid)
                        .get();

                    if (doc.exists) {

                        this.currentProfile = {

                            id: doc.id,

                            ...doc.data()

                        };

                    } else {

                        this.currentProfile = null;

                    }

                } catch (error) {

                    console.error(error);

                }

                window.dispatchEvent(

                    new CustomEvent(

                        "lunovia:login",

                        {

                            detail: {

                                auth: this.currentUser,

                                profile: this.currentProfile

                            }

                        }

                    )

                );

            }

        );

    },

    getUser() {

        return this.currentUser;

    },

    getProfile() {

        return this.currentProfile;

    },

    isLoggedIn() {

        return this.currentUser !== null;

    },

    isAdmin() {

        if (!this.currentProfile) {

            return false;

        }

        return this.currentProfile.role === "admin";

    }

};

/*==================================================
START
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try {

        const initialized = await FirebaseManager.initialize();

        if (!initialized) {

            console.error("Firebase failed to initialize.");

            return;

        }

        FirebaseManager.Session.initialize();

        console.log("LUNOVIA Firebase Services Ready");

    } catch (error) {

        console.error("Startup Error:", error);

    }

});
