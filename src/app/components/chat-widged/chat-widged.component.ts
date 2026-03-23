import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatAiService } from 'src/app/services/chat-ia.service';


@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  template: `
  <div class="chat-widget" [class.open]="isOpen">
    <button (click)="toggleChat()" class="chat-toggle">{{ isOpen ? 'Cerrar' : 'Chatear' }}</button>
    <div *ngIf="isOpen" class="chat-window">
      <div class="messages">
        <div *ngFor="let m of messages" [ngClass]="m.sender">{{ m.text }}</div>
      </div>
      <form (submit)="sendMessage(); $event.preventDefault();" class="chat-form">
        <input [(ngModel)]="message" name="message" placeholder="Escribe tu mensaje..." />
        <button type="submit">Enviar</button>
      </form>
    </div>
  </div>
  `,
  styles: [`
    .chat-widget { position: fixed; bottom: 16px; right: 16px; z-index: 1000; }
    .chat-toggle { display:block; padding:8px 12px; border-radius:4px; background:#3880ff; color:#fff; border:none; }
    .chat-window { width: 320px; max-width: calc(100vw - 32px); background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); overflow:hidden; margin-top:8px; }
    .messages { max-height: 300px; overflow:auto; padding:8px; }
    .user { text-align:right; margin:4px 0; }
    .ai { text-align:left; margin:4px 0; color:#333; }
    .chat-form { display:flex; gap:8px; padding:8px; }
    input[name="message"] { flex:1; padding:8px; border:1px solid #ddd; border-radius:4px; }
    button[type="submit"] { padding:8px 12px; border-radius:4px; background:#10dc60; color:#fff; border:none; }
  `]
})
export class ChatWidgetComponent {
  isOpen = false;
  message = '';
  messages: { sender: string; text: string }[] = [];

  constructor(private chatService: ChatAiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.message.trim()) return;

    const userMsg = this.message;
    this.messages.push({ sender: 'user', text: userMsg });
    this.message = '';

    try {
      const aiReply = await this.chatService.ask(userMsg);
      this.messages.push({ sender: 'ai', text: aiReply });
    } catch (error) {
      this.messages.push({ sender: 'ai', text: 'Error al conectar con la IA.' });
      console.error(error);
    }
  }
}
