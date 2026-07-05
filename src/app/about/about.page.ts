import { Component } from '@angular/core';
import { IonContent, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons'; 
import { 
  calculatorOutline, 
  shieldCheckmarkOutline, 
  eyeOffOutline, 
  flashOutline, 
  trendingUpOutline, 
  arrowForwardOutline, 
  analyticsOutline, 
  statsChart, 
  documentText, 
  newspaperOutline 
} from 'ionicons/icons';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [IonIcon, IonButton, IonContent],
})
export class AboutPage {

  constructor() {
    addIcons({
      'calculator-outline': calculatorOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'eye-off-outline': eyeOffOutline,
      'flash-outline': flashOutline,
      'trending-up-outline': trendingUpOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'analytics-outline': analyticsOutline,
      'stats-chart': statsChart,
      'document-text': documentText,
      'newspaper-outline': newspaperOutline
    });
  }

  contactWhatsApp() {
    const phoneNumber = '593969743150'; // Formato internacional para Ecuador sin el '+'
    const message = encodeURIComponent('Hola Redex-Tech, vengo desde la plataforma Voces y me gustaría recibir soporte técnico.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Abre el enlace en una pestaña nueva de forma segura
    window.open(whatsappUrl, '_blank');
  }
}
