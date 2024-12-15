import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Disable default change detection
})
export default class RegisterComponent {
  // Signals for state management
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Reactive Form
  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['customer', Validators.required], // Default to "customer"
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password, role } = this.registerForm.value;

      this.isLoading.set(true);
      this.errorMessage.set(null);

      try {
        await this.authService.register(email!, password!, role! as "customer" | "admin",  firstName!, lastName!);
        alert('User registered successfully');
        this.router.navigate(['/auth/login']);
      } catch (error: any) {
        this.errorMessage.set(error.message);
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
