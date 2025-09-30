import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../../core/Models/auth.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login  implements OnInit{
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

 onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.loading = true;

  this.authService.login(this.loginForm.value).subscribe({
    next: (res) => {
      this.loading = false;

      // ✅ No need to call saveToken manually,
      // it's already handled inside AuthService.login()

      const role = this.authService.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/add-sale']);
      }

      this.toastr.success('Login successful!');
    },
    error: (err) => {
      this.loading = false;
      this.toastr.error(err.error?.error || 'Login failed');
    },
  });
}

}