import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Lock, User, LogIn, UserPlus, Sun, Moon } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // Iconos disponibles para el template
  readonly LockIcon = Lock;
  readonly UserIcon = User;
  readonly LoginIcon = LogIn;
  readonly UserPlusIcon = UserPlus;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  isRegisterMode = false;
  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isDarkMode = false;

  constructor(private authService: AuthService, private router: Router) {
    // Detectar preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isRegisterMode) {
      // Registro
      this.authService.register({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.successMessage = '¡Registro exitoso! Ahora puedes iniciar sesión.';
            this.isRegisterMode = false;
            this.password = '';
          } else {
            this.errorMessage = res.message || 'Error en el registro.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error al conectar con el servidor.';
        }
      });
    } else {
      // Login
      this.authService.login({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            // Redirigir a la app principal (luego configuraremos la ruta)
            console.log('Token guardado:', res.data);
            this.router.navigate(['/dashboard']);
            // Aquí lo mandaremos al dashboard principal más adelante
          } else {
            this.errorMessage = res.message || 'Credenciales inválidas.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Usuario o contraseña incorrectos.';
        }
      });
    }
  }
}