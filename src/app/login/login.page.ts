import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

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

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) return;

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      const user = userCredential.user;

      // Obtener rol desde Firestore
      const q = query(collection(this.firestore, 'users'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const userData = snapshot.docs[0]?.data();
      const role = userData?.['role'] || 'normal';

      // Redirigir según rol
      if (role === 'normal' || role === 'registered') {
        this.router.navigate(['/evaluator']);
      } else if (role === 'admin') {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error login:', error);
    }
  }
}



