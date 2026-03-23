import { Component } from '@angular/core';
import { ChatAiService } from 'src/app/services/chat-ia.service';


@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.page.html',
  styleUrls: ['./chat-ai.page.scss']
})
export class ChatAiComponent {
  isOpen = false;
  messages: { text: string; sender: 'user' | 'bot' }[] = [];
  newMessage = '';

  constructor(private chatService: ChatAiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;
    const text = this.newMessage;
    this.messages.push({ text, sender: 'user' });
    this.newMessage = '';

    const response = await this.chatService.ask(text);
    this.messages.push({ text: response, sender: 'bot' });
  }
}
