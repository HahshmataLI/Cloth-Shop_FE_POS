import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// import { SidebarModule } from 'primeng/sidebar';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  sidebarVisible = false;

  constructor(public auth: Auth) {}

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }

  onLogout() {
    this.auth.logout();
  }
}