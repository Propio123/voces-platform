import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonText, IonCard, IonCardHeader, IonCardContent
} from "@ionic/angular/standalone";
import Chart from 'chart.js/auto';

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
  analyses$: Observable<any[]> | undefined;
  allAnalyses: any[] = [];
  filteredAnalyses: any[] = [];
  countries: string[] = [];
  selectedCountry: string = 'Todos';

  avgSalary: number = 0;
  avgScore: number = 0;
  avgHours: number = 0;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadAnalyses();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderCharts(), 1000);
  }

  loadAnalyses() {
    const ref = collection(this.firestore, 'analyses');
    this.analyses$ = collectionData(ref, { idField: 'id' }).pipe(
      map(data => data.filter(a => a['salary'] && a['score'])) // Filtra datos válidos
    );

    this.analyses$.subscribe(data => {
      this.allAnalyses = data;
      this.countries = ['Todos', ...new Set(data.map(a => a.country))];
      this.applyFilters();
    });
  }

  applyFilters() {
    if (this.selectedCountry === 'Todos') {
      this.filteredAnalyses = this.allAnalyses;
    } else {
      this.filteredAnalyses = this.allAnalyses.filter(a => a.country === this.selectedCountry);
    }

    if (this.filteredAnalyses.length > 0) {
      this.calculateStats();
      this.renderCharts();
    }
  }

  calculateStats() {
    const total = this.filteredAnalyses.length;
    this.avgSalary = this.filteredAnalyses.reduce((sum, a) => sum + a.salary, 0) / total;
    this.avgScore = this.filteredAnalyses.reduce((sum, a) => sum + a.score, 0) / total;
    this.avgHours = this.filteredAnalyses.reduce((sum, a) => sum + a.hoursPerWeek, 0) / total;
  }

  renderCharts() {
    const ctx1 = document.getElementById('salaryChart') as HTMLCanvasElement;
    const ctx2 = document.getElementById('scoreChart') as HTMLCanvasElement;

    if (!ctx1 || !ctx2) return;

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

    // Limpia gráficos previos
    Chart.getChart('salaryChart')?.destroy();
    Chart.getChart('scoreChart')?.destroy();

    // Gráfico de barras: salario promedio por país
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Salario promedio (USD)',
          data: salaries,
        }]
      }
    });

    // Gráfico de radar: relación salario/puntaje/horas
    const avgSalary = this.avgSalary;
    const avgScore = this.avgScore;
    const avgHours = this.avgHours;

    new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: ['Salario', 'Puntaje', 'Horas por semana'],
        datasets: [{
          label: this.selectedCountry,
          data: [avgSalary, avgScore, avgHours],
          fill: true
        }]
      }
    });
  }
}
