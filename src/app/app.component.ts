import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { IonApp, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonButton, IonIcon, IonContent, IonFooter, IonMenu, IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { RouterModule, RouterOutlet } from "@angular/router";
import { ChatWidgetComponent } from "./components/chat-widged/chat-widged.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { homeOutline, informationCircleOutline, personOutline, logInOutline } from 'ionicons/icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, RouterModule,AsyncPipe, IonLabel, IonItem, IonList, IonFooter, IonContent, IonIcon, IonButton, IonTitle, IonButtons, IonHeader, IonToolbar, IonMenuButton, RouterOutlet, ChatWidgetComponent, IonApp, IonMenu],
})
export class AppComponent {
  public menuIcons = {
    home: homeOutline,
    about: informationCircleOutline,
    profile: personOutline,
    login: logInOutline
  };
   currentYear = new Date().getFullYear();
  // Exponemos el flujo directamente a la vista HTML
  userRole$: Observable<string | null>;

  constructor(private authService: AuthService) {
    
    this.userRole$ = this.authService.getUserRole();
  }

  logout() {
    this.authService.logout();
  }
}