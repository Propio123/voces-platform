import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import Chart from 'chart.js/auto';
import { 
  calculatorOutline, 
  shieldCheckmarkOutline, 
  eyeOffOutline, 
  flashOutline, 
  trendingUpOutline, 
  arrowForwardOutline, 
  analyticsOutline, 
  statsChartOutline, 
  documentTextOutline, 
  newspaperOutline 
} from 'ionicons/icons';

interface AnalysisData {
  country: string;
  job: string;
  salary: number;
  hoursPerWeek: number;
  score: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit, AfterViewInit {
  private firestore = inject(Firestore);

  // Mapeo de íconos para la vista unificada
  public homeIcons = {
    calculator: calculatorOutline,
    shield: shieldCheckmarkOutline,
    eyeOff: eyeOffOutline,
    flash: flashOutline,
    trending: trendingUpOutline,
    arrowForward: arrowForwardOutline,
    analytics: analyticsOutline,
    stats: statsChartOutline,
    document: documentTextOutline,
    newspaper: newspaperOutline
  };

  // Variables del Observatorio / Dashboard ONG
  analyses: AnalysisData[] = [];
  filteredAnalyses: AnalysisData[] = [];
  countries: string[] = ['Todos'];
  selectedCountry = 'Todos';

  avgSalary = 0;
  avgScore = 0;
  avgHours = 0;

  salaryChart: any;
  scoreChart: any;

  // Noticias estáticas
  news = [
    {
      title: 'Monitoreo de brechas salariales 2026',
      content: 'Nuestra plataforma procesa datos anónimos para actualizar índices de cumplimiento laboral en tiempo real.'
    },
    {
      title: 'Transparencia e IA para la defensa de derechos',
      content: 'Herramientas automatizadas permiten a los trabajadores contrastar sus jornadas frente al marco legal vigente.'
    }
  ];

  ngOnInit() {
    this.loadAnalysesData();
  }

  ngAfterViewInit() {
    // Inicialización diferida de gráficos
  }

  private loadAnalysesData() {
    const collectionRef = collection(this.firestore, 'analyses');
    collectionData(collectionRef).subscribe((data: any[]) => {
      this.analyses = data || [];
      
      // Mapear países únicos para el selector
      const uniqueCountries = Array.from(new Set(this.analyses.map(a => a.country).filter(Boolean)));
      this.countries = ['Todos', ...uniqueCountries];

      this.applyFilters();
    });
  }

  applyFilters() {
    if (this.selectedCountry === 'Todos') {
      this.filteredAnalyses = [...this.analyses];
    } else {
      this.filteredAnalyses = this.analyses.filter(a => a.country === this.selectedCountry);
    }

    this.calculateMetrics();
    this.updateCharts();
  }

  private calculateMetrics() {
    if (this.filteredAnalyses.length === 0) {
      this.avgSalary = 0;
      this.avgScore = 0;
      this.avgHours = 0;
      return;
    }

    const totalSalary = this.filteredAnalyses.reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const totalScore = this.filteredAnalyses.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const totalHours = this.filteredAnalyses.reduce((acc, curr) => acc + (curr.hoursPerWeek || 0), 0);

    const count = this.filteredAnalyses.length;
    this.avgSalary = totalSalary / count;
    this.avgScore = totalScore / count;
    this.avgHours = totalHours / count;
  }

  private updateCharts() {
    const labels = this.filteredAnalyses.slice(-10).map(a => a.job || 'N/A');
    const salaries = this.filteredAnalyses.slice(-10).map(a => a.salary || 0);
    const scores = this.filteredAnalyses.slice(-10).map(a => a.score || 0);

    // Gráfico 1: Salarios
    const ctxSalary = document.getElementById('salaryChart') as HTMLCanvasElement;
    if (ctxSalary) {
      if (this.salaryChart) this.salaryChart.destroy();
      this.salaryChart = new Chart(ctxSalary, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Salario (USD)',
            data: salaries,
            backgroundColor: 'rgba(45, 211, 111, 0.6)',
            borderColor: '#2dd36f',
            borderWidth: 1
          }]
        },
        options: { responsive: true }
      });
    }

    // Gráfico 2: Puntajes
    const ctxScore = document.getElementById('scoreChart') as HTMLCanvasElement;
    if (ctxScore) {
      if (this.scoreChart) this.scoreChart.destroy();
      this.scoreChart = new Chart(ctxScore, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Índice de Justicia Laboral',
            data: scores,
            borderColor: '#5260ff',
            backgroundColor: 'rgba(82, 96, 255, 0.2)',
            fill: true
          }]
        },
        options: { responsive: true }
      });
    }
  }
}