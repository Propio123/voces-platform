import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
})
export class UserDashboardPage {
  analyses: any[] = [];

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user) return;

    const q = query(collection(this.firestore, 'analyses'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    this.analyses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

