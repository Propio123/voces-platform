import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  role: 'normal' | 'registered' = 'normal'; // Roles permitidos para registro

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async register() {
    if (!this.name || !this.email || !this.password) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: this.name });

      // Guardar el rol en Firestore
      await addDoc(collection(this.firestore, 'users'), {
        uid: user.uid,
        name: this.name,
        email: this.email,
        role: this.role,
        createdAt: new Date()
      });

      // Redirigir según rol
      this.router.navigate(['/evaluator']); // Todos van al evaluador por defecto
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  }
}

