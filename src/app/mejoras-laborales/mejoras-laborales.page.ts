import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mejoras-laborales',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mejoras-laborales.page.html',
  styleUrls: ['./mejoras-laborales.page.scss'],
})
export class MejorasLaboralesPage {
  job = '';
  salary: number | null = null;
  hoursPerWeek: number | null = null;
  country = 'Ecuador';
  workConditions = '';
  benefits = '';
  satisfaction = 5;

  loading = false;
  result = '';
  score = 0;
  color = 'success';

  constructor(private http: HttpClient) {}

  async analyzeImprovements() {
    if (!this.job || !this.salary || !this.hoursPerWeek || !this.workConditions) {
      alert('Por favor, completa todos los campos antes de analizar.');
      return;
    }

    this.loading = true;
    this.result = '';

    const message = `
Soy trabajador en el área de ${this.job}.
Trabajo ${this.hoursPerWeek} horas por semana y gano ${this.salary} USD al mes en ${this.country}.
Mis condiciones laborales son: ${this.workConditions}.
Beneficios que recibo: ${this.benefits || 'ninguno'}.
Mi nivel de satisfacción actual es ${this.satisfaction}/10.

Por favor, analiza mi situación laboral y dame sugerencias realistas para mejorar mis condiciones y salario.
`;

    try {
      const response: any = await this.http
        .post('http://localhost:3000/chat-advice', { message })
        .toPromise();

      this.result = response.reply || 'No se obtuvo respuesta del modelo.';

      // Simular puntuación IA (según tono)
      this.score = this.result.includes('excelente') ? 90 :
                   this.result.includes('adecuado') ? 70 :
                   this.result.includes('mejorar') ? 50 : 40;

      if (this.score >= 80) this.color = 'success';
      else if (this.score >= 60) this.color = 'warning';
      else this.color = 'danger';
    } catch (err) {
      console.error('❌ Error en el análisis IA:', err);
      this.result = 'Error conectando con el servidor.';
    } finally {
      this.loading = false;
    }
  }
}
