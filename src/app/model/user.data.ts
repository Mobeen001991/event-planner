export interface CurrentUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    phoneNumber: string | null;
    providerId: string;
    role?: string; // Role retrieved from Firestore or custom claims
    isAdmin?: boolean; // Custom claim for admin role
  }
  