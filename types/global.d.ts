declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_FIREBASE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    APPLE_ID: string;
    APPLE_SECRET: string;
  }
}

interface Window {
  recaptchaVerifier?: any;
  recaptchaWidgetId?: number;
}

declare module "firebase/app" {
  interface FirebaseOptions {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  }

  interface FirebaseApp {
    name: string;
    options: FirebaseOptions;
  }

  export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
  export function getApp(name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
}

// Extend Firebase Auth types
declare module "firebase/auth" {
  interface User {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    toJSON(): object;
  }

  export interface Auth {
    app: import("firebase/app").FirebaseApp;
    name: string;
    config: object;
    currentUser: User | null;
    signOut(): Promise<void>;
  }

  export interface UserCredential {
    user: User;
  }

  export class PhoneAuthProvider {
    static credential(verificationId: string, verificationCode: string): any;
  }

  export class RecaptchaVerifier {
    constructor(
      container: string | HTMLElement,
      parameters?: object,
      app?: import("firebase/app").FirebaseApp
    );
    clear(): void;
    render(): Promise<number>;
    verify(): Promise<string>;
  }

  export function getAuth(app?: import("firebase/app").FirebaseApp): Auth;
  export function signInWithPhoneNumber(
    auth: Auth,
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ): Promise<any>;
  export function signInWithCredential(
    auth: Auth,
    credential: any
  ): Promise<UserCredential>;
  export function onAuthStateChanged(
    auth: Auth,
    nextOrObserver: ((user: User | null) => void) | object,
    error?: (error: Error) => void,
    completed?: () => void
  ): () => void;
}
