import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ChatWidgetComponent } from './components/chat-widged/chat-widged.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, FormsModule, ChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentYear = new Date().getFullYear();
  isLoggedIn = false;
  isAdmin = false;
  userName = '';

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.displayName || '';
        await this.checkUserRole(user.uid);
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.userName = '';
      }
    });
  }

  async checkUserRole(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      this.isAdmin = data['role'] === 'admin';
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Mostrar u ocultar elementos del navbar
  showHome() { return true; }
  showAbout() { return true; }
  showEvaluator() { return this.isLoggedIn; }
  showRegister() { return !this.isLoggedIn; }
  showLogin() { return !this.isLoggedIn; }
  showLogout() { return this.isLoggedIn; }
  showDashboardOng() { return this.isAdmin; }
  showChat() { return this.isLoggedIn; } // Chat visible solo si está logueado
}

