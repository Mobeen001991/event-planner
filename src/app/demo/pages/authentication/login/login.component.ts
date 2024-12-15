import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent {
  // Reactive Form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false], // Optional remember me checkbox
  });

  // Signals for state management
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  // Submit Login Form
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        await this.authService.signIn(email!, password!);
        alert('Login successful');
        this.router.navigate(['/create-event']); // Adjust the navigation path as needed
      } catch (error: any) {
        this.errorMessage.set('Invalid email or password. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  // Google Sign-In
  async signInWithGoogle() {
    try {
      this.isLoading.set(true);
      await this.authService.signInWithGoogle();
      this.router.navigate(['/dashboard']); // Adjust the navigation path as needed
    } catch (error: any) {
      this.errorMessage.set('Google sign-in failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
