import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router'; // 🌟 Añadimos Router
 // 🌟 Ajusta la ruta a tu servicio real
import { mailOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  // Variables para el formulario de login
  email = '';
  password = '';

  public loginIcons = {
    mail: mailOutline,
    lock: lockClosedOutline,
    logIn: logInOutline
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async onLogin() {
    if (!this.email || !this.password) {
      console.warn('Por favor, llena todos los campos.');
      return;
    }

    try {
      console.log('Iniciando sesión para:', this.email);
      await this.authService.login(this.email, this.password);
      
      // Una vez logueado, escuchamos el rol que recupera el AuthService para redirigir
      this.authService.getUserRole().subscribe(role => {
        if (role) {
          console.log('Rol obtenido con éxito:', role);
          if (role === 'admin') {
            this.router.navigate(['/dashboard-ong']);
          } else {
            this.router.navigate(['/dashboard-user']);
          }
        }
      });

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes colocar una alerta visual de Ionic para avisar al usuario si la contraseña es incorrecta
    }
  }
}
