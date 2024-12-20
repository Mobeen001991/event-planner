import { Injectable, signal } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUserSignal.set(user);
      await this.getUserRole();
    });
  }
  get currentUser() {
    return this.currentUserSignal;
  }
  get userRole() {
    return this.userRoleSignal;
  }
  private currentUserSignal = signal<User | null>(null); // Signal for current user
  private userRoleSignal = signal<string>(''); // Signal for current user

  // Get the current user's information
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }
  // Register a new user
  async register(email: string, password: string, role: 'admin' | 'customer', firstName: string, lastName: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // Update the user's displayName
    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
    // Save user role in Firestore
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDoc, { email: user.email, role, firstName, lastName, displayName: `${firstName} ${lastName}` });

    return user;
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Get the current user role
  async getUserRole(): Promise<string | null> {
    if (!this.currentUser) return null;
    const userDoc = doc(this.firestore, `users/${this.currentUser()?.uid}`);
    const userSnapshot = await getDoc(userDoc);
    console.log(userSnapshot.data())
    return userSnapshot.exists() ? (userSnapshot.data() as any).role : null;
  }
  // Google Sign-In
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }
  // Logout
  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/auth/login']);
  }
}
