import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, FileText, Users, GraduationCap, LogOut, Sun, Moon } from 'lucide-angular';
import { NotesComponent } from '../notes/notes.component';
import { ProfessorsComponent } from '../professors/professors.component';
import { StudentsComponent } from '../students/students.component';
import { ToastComponent } from '../toast/toast.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NotesComponent, ProfessorsComponent, StudentsComponent, ToastComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  readonly NotesIcon = FileText;
  readonly ProfessorsIcon = Users;
  readonly StudentsIcon = GraduationCap;
  readonly LogoutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  activeTab: 'notes' | 'professors' | 'students' = 'notes';
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  ngOnInit(): void {
    // REQUISITO 4: Validar JWT al entrar al dashboard
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  setTab(tab: 'notes' | 'professors' | 'students'): void { this.activeTab = tab; }
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  logout(): void { this.authService.logout(); this.router.navigate(['/']); }
}