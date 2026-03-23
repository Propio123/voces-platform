import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-evaluator',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './evaluator.page.html',
  styleUrls: ['./evaluator.page.scss'],
})
export class EvaluatorPage {
  job = '';
  hoursPerWeek: number | null = null;
  salary: number | null = null;
  country = 'Ecuador';
  analysis = '';
  score = 0;
  color = 'success';
  loading = false;

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async evaluateSalary() {
    if (!this.job || !this.salary || !this.hoursPerWeek) return;

    this.loading = true;

    try {
      const body = {
        job: this.job,
        hoursPerWeek: this.hoursPerWeek,
        salary: this.salary,
        country: this.country,
      };

      const response: any = await this.http
        .post('http://localhost:3000/evaluate-salary', body)
        .toPromise();

      this.analysis = response.analysis || 'No se pudo obtener respuesta.';
      // Calcular score
      const hourly = this.salary / (this.hoursPerWeek * 4);
      if (hourly < 1.5) {
        this.score = 25;
        this.color = 'danger';
      } else if (hourly < 3) {
        this.score = 60;
        this.color = 'warning';
      } else {
        this.score = 90;
        this.color = 'success';
      }

      // Guardar en Firestore si el usuario está logueado
      const user = this.auth.currentUser;
      if (user) {
        await addDoc(collection(this.firestore, 'analyses'), {
          userId: user.uid,
          userEmail: user.email,
          job: this.job,
          hoursPerWeek: this.hoursPerWeek,
          salary: this.salary,
          country: this.country,
          result: this.analysis,
          score: this.score,
          color: this.color,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error evaluando salario:', error);
    } finally {
      this.loading = false;
    }
  }
}
