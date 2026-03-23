import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  currentYear = new Date().getFullYear();

  news = [
    { title: 'Nuevo informe laboral 2025', content: 'Se publica el informe regional sobre justicia salarial y condiciones laborales en Latinoamérica.' },
    { title: 'Vocés impulsa capacitaciones', content: 'La ONG lanza un programa para fortalecer la educación laboral en comunidades rurales.' },
    { title: 'IA al servicio del trabajo digno', content: 'Nuestro sistema de evaluación ahora incluye análisis por sector económico.' }
  ];
}

