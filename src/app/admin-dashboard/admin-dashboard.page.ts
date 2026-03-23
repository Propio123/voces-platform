import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage {
  analyses: any[] = [];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const querySnapshot = await getDocs(collection(this.firestore, 'analyses'));
    this.analyses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
