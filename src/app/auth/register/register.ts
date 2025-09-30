import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Router ,RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class  Register implements OnInit {
  registerForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['cashier', Validators.required] // default role
    });
  }

  onSubmit(): void {
  if (this.registerForm.invalid) return;

  this.loading = true;

  this.authService.register(this.registerForm.value).subscribe({
    next: () => {
      this.loading = false;

      // ✅ Token & user are already saved inside register()
      const role = this.authService.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/cashier']);
      }

      this.toastr.success('Registration successful!');
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error(err.error?.error || 'Registration failed');
    }
  });
}

}