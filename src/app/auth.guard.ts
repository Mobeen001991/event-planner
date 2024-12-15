import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await new Promise((resolve) => onAuthStateChanged(this.auth, resolve));
    if (user) {
      return true; // User is logged in, grant access
    } else {
      this.router.navigate(['/auth/login']); // Redirect to login
      return false; // Block access
    }
  }
}
