import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-ong',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './chat-ong.page.html',
  styleUrls: ['./chat-ong.page.scss']
})
export class ChatOngPage {
  messages = [{ from: 'ONG', text: 'Hola 👋 ¿En qué podemos ayudarte hoy?' }];
  userInput = '';

  sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ from: 'usuario', text: this.userInput });
    this.userInput = '';
  }
}
