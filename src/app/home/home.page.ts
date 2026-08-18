import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
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
export class HomePage implements OnInit {
  private firestore = inject(Firestore);

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

  analyses: AnalysisData[] = [];
  filteredAnalyses: AnalysisData[] = [];
  countries: string[] = ['Todos'];
  selectedCountry = 'Todos';

  avgSalary = 0;
  avgScore = 0;
  avgHours = 0;

  salaryChart: any;
  scoreChart: any;

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

  // Carga de datos directa solucionando el conflicto de tipos del SDK
  async loadAnalysesData() {
    try {
      const colRef = collection(this.firestore, 'analyses');
      const snapshot = await getDocs(colRef);
      this.analyses = snapshot.docs.map(doc => doc.data() as AnalysisData);
      
      const uniqueCountries = Array.from(new Set(this.analyses.map(a => a.country).filter(Boolean)));
      this.countries = ['Todos', ...uniqueCountries];

      this.applyFilters();
    } catch (error) {
      console.error('Error al cargar datos del observatorio:', error);
    }
  }

  applyFilters() {
    if (this.selectedCountry === 'Todos') {
      this.filteredAnalyses = [...this.analyses];
    } else {
      this.filteredAnalyses = this.analyses.filter(a => a.country === this.selectedCountry);
    }

    this.calculateMetrics();
    setTimeout(() => this.updateCharts(), 100);
  }

  private calculateMetrics() {
    if (this.filteredAnalyses.length === 0) {
      this.avgSalary = 0;
      this.avgScore = 0;
      this.avgHours = 0;
      return;
    }

    const totalSalary = this.filteredAnalyses.reduce((acc, curr) => acc + (Number(curr.salary) || 0), 0);
    const totalScore = this.filteredAnalyses.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    const totalHours = this.filteredAnalyses.reduce((acc, curr) => acc + (Number(curr.hoursPerWeek) || 0), 0);

    const count = this.filteredAnalyses.length;
    this.avgSalary = totalSalary / count;
    this.avgScore = totalScore / count;
    this.avgHours = totalHours / count;
  }

  private updateCharts() {
    const labels = this.filteredAnalyses.slice(-10).map(a => a.job || 'N/A');
    const salaries = this.filteredAnalyses.slice(-10).map(a => a.salary || 0);
    const scores = this.filteredAnalyses.slice(-10).map(a => a.score || 0);

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
            backgroundColor: 'rgba(82, 96, 255, 0.7)',
            borderColor: '#5260ff',
            borderWidth: 1
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

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
            borderColor: '#7044ff',
            backgroundColor: 'rgba(112, 68, 255, 0.2)',
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
}