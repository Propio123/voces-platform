import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async login() {
    if (!this.email || !this.password) return;

    try {
      console.log('1. Iniciando proceso de firma en Firebase Auth...');
      await this.authService.login(this.email, this.password);
      console.log('2. Autenticación exitosa. Esperando respuesta de Firestore...');

      // Escuchamos el canal del rol de forma activa
      const sub = this.authService.getUserRole().subscribe(role => {
        console.log('3. Valor emitido por el canal de roles:', role);

        // Si es null, significa que Firestore aún está procesando; esperamos la siguiente emisión
        if (role === null) return; 

        console.log('4. Evaluando redirección para el rol verídico:', role);
        
        // Cancelamos la suscripción para evitar bucles antes de navegar
        sub.unsubscribe(); 

        // 🚨 VERIFICA AQUÍ: ¿Tus rutas en app.routes.ts se escriben exactamente así?
        if (role === 'admin') {
          console.log('Redirigiendo a Dashboard ONG...');
          this.router.navigateByUrl('/dashboard-ong');
        } else if (role === 'register') {
          console.log('Redirigiendo a Evaluador...');
          this.router.navigateByUrl('/evaluator');
        } else {
          console.log('Redirigiendo a Home...');
          this.router.navigateByUrl('/home');
        }
      });

    } catch (error) {
      console.error('Error crítico en el proceso de login:', error);
    }
  }
}


