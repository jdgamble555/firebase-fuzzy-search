import { PRIVATE_FIREBASE_ADMIN_CONFIG } from '$env/static/private';
import { getApps, initializeApp, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


const firebase_admin_config = JSON.parse(PRIVATE_FIREBASE_ADMIN_CONFIG);

// initialize admin firebase only once
export const adminApp = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(firebase_admin_config),
        projectId: firebase_admin_config.project_id
    });

export const adminAuth = getAuth(adminApp);
export const adminDB = getFirestore(adminApp, 'firestore-testing');




