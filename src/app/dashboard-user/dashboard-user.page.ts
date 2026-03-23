import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonCardTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.page.html',
  styleUrls: ['./dashboard-user.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardContent, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DashboardUserPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
