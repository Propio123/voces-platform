import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule,IonicModule],
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage {
  newsList = [
    {
      title: 'Reformas laborales impulsan nuevos derechos',
      date: '5 Nov 2025',
      image: 'assets/news1.jpg',
      summary: 'El Ministerio de Trabajo anunció cambios que mejoran la transparencia salarial en sectores agrícolas.'
    },
    {
      title: 'IA evalúa equidad laboral en América Latina',
      date: '3 Nov 2025',
      image: 'assets/news2.jpg',
      summary: 'Un nuevo sistema basado en inteligencia artificial analiza los salarios y condiciones de trabajo.'
    },
    {
      title: 'ONG Voces promueve justicia salarial',
      date: '1 Nov 2025',
      image: 'assets/news3.jpg',
      summary: 'Voces lidera una red de apoyo para trabajadores en situación de vulnerabilidad económica.'
    }
  ];
}
