import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
  <ion-header>
    <ion-toolbar color="tertiary">
      <ion-title>Panel ONG</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <h2>Reportes Generales</h2>
    <ion-list>
      <ion-item *ngFor="let e of allEvaluations">
        <ion-label>
          <h3>{{ e.job }}</h3>
          <p>{{ e.country }} - Sueldo: \${{ e.salary }} | IA Score: {{ e.score }}%</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class ReportsPage {
  allEvaluations: any[] = [];

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const snapshot = await getDocs(collection(this.firestore, 'evaluations'));
    this.allEvaluations = snapshot.docs.map(d => d.data());
  }
}
