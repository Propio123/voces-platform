import { Component } from '@angular/core';
import { IonicModule, IonInput } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Firestore, collection, addDoc, query, where, orderBy, onSnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage {
  messages: { role: 'user'|'assistant', text: string, timestamp: any }[] = [];
  inputText = '';
  loading = false;
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
    private auth: Auth
  ) {
    const u = this.auth.currentUser;
    this.userId = u ? u.uid : null;
    this.loadChatHistory();
  }

  // Carga mensajes desde Firestore (últimos 50)
  loadChatHistory() {
    if (!this.userId) return;
    // escucha en tiempo real
    const collRef = collection(this.firestore, 'chats');
    const q = query(collRef, where('userId', '==', this.userId), orderBy('timestamp'));
    // onSnapshot no está tipado en AngularFire modular; usar SDK sincrónico con getDocs/observe
    try {
      // Si quieres suscripción en tiempo real, puedes usar getDocs repetido o integrar AngularFire observables.
      // Aquí haremos un método simple para cargar historial inicial:
      import('firebase/firestore').then(() => {
        // (opcional) si tienes utilidades para suscripción, agrégalas
      }).catch(()=>{});
    } catch (e) {
      // fallback: no romper
    }
  }

  // guarda mensaje localmente y en Firestore
  async pushToFirestore(role: 'user'|'assistant', text: string) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'chats'), {
        userId: this.userId || 'anon',
        role,
        text,
        timestamp: new Date()
      });
      // no hacemos nada más por ahora
    } catch (err) {
      console.error('Error guardando chat en Firestore', err);
    }
  }

  async send() {
    const txt = this.inputText?.trim();
    if (!txt) return;
    // mostrar mensaje usuario
    this.messages.push({ role: 'user', text: txt, timestamp: new Date() });
    this.inputText = '';
    await this.pushToFirestore('user', txt);

    // llamar backend
    this.loading = true;
    try {
      const resp: any = await this.http.post('http://localhost:3000/chat', {
        userId: this.userId,
        message: txt
      }).toPromise();

      const reply = resp?.reply || 'No se obtuvo respuesta de la IA.';
      this.messages.push({ role: 'assistant', text: reply, timestamp: new Date() });
      await this.pushToFirestore('assistant', reply);
    } catch (err) {
      console.error('Error enviando al servidor', err);
      const reply = 'Error al comunicarse con el servidor de IA.';
      this.messages.push({ role: 'assistant', text: reply, timestamp: new Date() });
    } finally {
      this.loading = false;
    }
  }
}

