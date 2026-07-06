import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonText, IonCard, IonCardHeader, IonCardContent, IonButton, IonIcon
} from "@ionic/angular/standalone";
import { Firestore, collection, query, getDocs } from '@angular/fire/firestore';
import Chart from 'chart.js/auto';

export interface LaborAnalysis {
  id?: string;
  country: string;
  job: string;
  salary: number;
  hoursPerWeek: number;
  score: number;
}

@Component({
  selector: 'app-dashboard-ong',
  templateUrl: './dashboard-ong.page.html',
  styleUrls: ['./dashboard-ong.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonText, IonCard, IonCardHeader, IonCardContent
  ],
})
export class DashboardOngComponent implements OnInit, AfterViewInit {
  // Inyección segura dentro del contexto de Angular
  private firestore = inject(Firestore);

  allAnalyses: LaborAnalysis[] = [];
  filteredAnalyses: LaborAnalysis[] = [];
  countries: string[] = [];
  selectedCountry: string = 'Todos';

  avgSalary: number = 0;
  avgScore: number = 0;
  avgHours: number = 0;

  constructor() {}

  ngOnInit() {
    this.loadAnalyses();
  }

  ngAfterViewInit() {
    // Un pequeño delay controlado para asegurar que los elementos canvas existan en el DOM
    setTimeout(() => this.renderCharts(), 800);
  }

  // 🌟 Solución Definitiva: Usamos async/await con getDocs nativo (Adios collectionData y errores de inyección)
  async loadAnalyses() {
    try {
      const ref = collection(this.firestore, 'analyses');
      const q = query(ref);
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LaborAnalysis[];

      // Filtramos registros que tengan datos numéricos clave válidos
      this.allAnalyses = data.filter(a => a.salary && a.score);
      
      // Extraemos los países únicos
      this.countries = ['Todos', ...new Set(this.allAnalyses.map(a => a.country))];
      
      this.applyFilters();

    } catch (err) {
      console.error('Error definitivo en la carga de Firestore:', err);
    }
  }

  applyFilters() {
    if (this.selectedCountry === 'Todos') {
      this.filteredAnalyses = this.allAnalyses;
    } else {
      this.filteredAnalyses = this.allAnalyses.filter(a => a.country === this.selectedCountry);
    }

    this.calculateStats();
    this.renderCharts();
  }

  calculateStats() {
    const total = this.filteredAnalyses.length;
    if (total === 0) {
      this.avgSalary = 0;
      this.avgScore = 0;
      this.avgHours = 0;
      return;
    }

    this.avgSalary = this.filteredAnalyses.reduce((sum, a) => sum + a.salary, 0) / total;
    this.avgScore = this.filteredAnalyses.reduce((sum, a) => sum + a.score, 0) / total;
    this.avgHours = this.filteredAnalyses.reduce((sum, a) => sum + a.hoursPerWeek, 0) / total;
  }

  renderCharts() {
    const ctx1 = document.getElementById('salaryChart') as HTMLCanvasElement;
    const ctx2 = document.getElementById('scoreChart') as HTMLCanvasElement;

    if (!ctx1 || !ctx2 || this.filteredAnalyses.length === 0) return;

    const salaryByCountry: Record<string, number[]> = {};
    this.filteredAnalyses.forEach(a => {
      if (!salaryByCountry[a.country]) salaryByCountry[a.country] = [];
      salaryByCountry[a.country].push(a.salary);
    });

    const labels = Object.keys(salaryByCountry);
    const salaries = labels.map(c => {
      const list = salaryByCountry[c];
      return list.reduce((s, n) => s + n, 0) / list.length;
    });

    // Limpieza de instancias previas de Chart.js para evitar parpadeos
    Chart.getChart('salaryChart')?.destroy();
    Chart.getChart('scoreChart')?.destroy();

    // Gráfico de barras: salarios promedio
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Salario promedio (USD)',
          data: salaries,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true }
    });

    // Gráfico de radar: métricas integradas
    new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: ['Salario Promedio', 'Puntaje IA', 'Horas Semanales'],
        datasets: [{
          label: this.selectedCountry,
          data: [this.avgSalary, this.avgScore, this.avgHours],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: { responsive: true }
    });
  }
}