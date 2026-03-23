import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // 🔥 Esto hace que Angular lo reconozca como inyectable
})
export class ChatAiService {
  private apiUrl = 'http://localhost:3000/api/chat'; // Cambia según tu backend

  constructor(private http: HttpClient) {}

  async ask(message: string): Promise<string> {
    try {
      const response: any = await this.http.post(this.apiUrl, { message }).toPromise();
      return response.reply || 'No se recibió respuesta de la IA.';
    } catch (error) {
      console.error('Error al comunicarse con la IA:', error);
      return 'Ocurrió un error al conectar con la IA.';
    }
  }
}
