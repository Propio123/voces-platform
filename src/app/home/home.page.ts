import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// 🌟 Importamos los objetos de los íconos directamente
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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit {
  
  // 🌟 Agrupamos los objetos de los íconos en una variable accesible por el HTML
  public homeIcons = {
    calculator: calculatorOutline,
    shield: shieldCheckmarkOutline,
    eyeOff: eyeOffOutline,
    flash: flashOutline,
    trending: trendingUpOutline,
    arrowForward: arrowForwardOutline,
    analytics: analyticsOutline,
    stats: statsChart,
    document: documentText,
    newspaper: newspaperOutline
  };

  news = [
    { title: 'Reforma Laboral 2026', content: 'Análisis de las nuevas regulaciones sobre horas extra en Ecuador.' },
    { title: 'Brecha Salarial', content: 'Estadísticas del impacto de la IA detectando discrepancias de sueldos.' }
  ];

  constructor() {}

  ngOnInit() {}
}
