import { Component, inject } from '@angular/core'; // 🌟 Importamos inject
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs'; // 🌟 Para manejar la promesa limpia

@Component({
  selector: 'app-app-evaluator',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './evaluator.page.html',
  styleUrls: ['./evaluator.page.scss'],
})
export class EvaluatorPage {
  // 🌟 Inyección limpia a nivel de clase inmune a la minificación
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  job = '';
  hoursPerWeek: number | null = null;
  salary: number | null = null;
  country = 'Ecuador';
  analysis = '';
  score = 0;
  color = 'success';
  loading = false;

  // Dejamos el constructor limpio
  constructor() {}

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

      // 🌟 Reemplazamos toPromise() por firstValueFrom() para compatibilidad estricta
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:3000/evaluate-salary', body)
      );

      this.analysis = response.analysis || 'No se pudo obtener respuesta.';
      
      // Calcular score alternativo
      const hourly = this.salary / (this.hoursPerWeek * 4);
      if (hourly < 1.5) {
        this.score = 25;
        this.color = '#eb445a'; // Usamos color hex/estándar por si el CSS nativo requiere el string directo
      } else if (hourly < 3) {
        this.score = 60;
        this.color = '#ffc409';
      } else {
        this.score = 90;
        this.color = '#2dd36f';
      }

      // Guardar en Firestore con contexto seguro
      const user = this.auth.currentUser;
      if (user) {
        const collectionRef = collection(this.firestore, 'analyses');
        await addDoc(collectionRef, {
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
