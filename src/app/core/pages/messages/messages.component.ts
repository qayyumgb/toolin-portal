import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ChatService, Conversation, ChatMessage } from '../../../shared/services/chat.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUid = '';
  loading = true;
  sendingMessage = false;

  private destroy$ = new Subject<void>();
  private otherUserCache: Map<string, any> = new Map();

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const profile = this.getProfile();
    this.currentUid = profile?.uid || profile?.id || '';

    if (!this.currentUid) {
      this.loading = false;
      return;
    }

    this.chatService.getMyConversations(this.currentUid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (conversations) => {
        for (const conv of conversations) {
          const otherUid = conv.buyerId === this.currentUid ? conv.sellerId : conv.buyerId;
          if (!this.otherUserCache.has(otherUid)) {
            try {
              const profile = await this.chatService.getUserProfile(otherUid)
                .pipe(takeUntil(this.destroy$)).toPromise();
              this.otherUserCache.set(otherUid, profile);
            } catch {}
          }
          const cached = this.otherUserCache.get(otherUid);
          conv.otherUserName = cached?.firstName && cached?.lastName
            ? `${cached.firstName} ${cached.lastName}`
            : cached?.email || 'User';
          conv.otherUserEmail = cached?.email || '';
        }
        this.conversations = conversations;
        this.loading = false;
      });
  }

  private getProfile(): any {
    try {
      return JSON.parse(localStorage.getItem('proifleDetail') || '{}');
    } catch { return {}; }
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.messages = [];
    this.chatService.getMessages(conversation.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      });
  }

  async sendMessage(): Promise<void> {
    if (!this.newMessage.trim() || !this.selectedConversation || this.sendingMessage) return;

    const text = this.newMessage.trim();
    this.newMessage = '';
    this.sendingMessage = true;

    const conv = this.selectedConversation;
    const recipientUid = conv.buyerId === this.currentUid ? conv.sellerId : conv.buyerId;

    try {
      await this.chatService.sendMessage(conv.id!, this.currentUid, text)
        .pipe(takeUntil(this.destroy$)).toPromise();

      // Get sender name
      const profile = this.getProfile();
      const senderName = profile.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`
        : profile.email || 'Seller';

      // In-app notification
      this.chatService.sendNotification(recipientUid, {
        conversationId: conv.id!,
        toolId: conv.toolId,
        toolName: conv.toolName,
        senderName,
      }).subscribe();

      // Email notification
      const recipientProfile = this.otherUserCache.get(recipientUid);
      if (recipientProfile?.email) {
        this.chatService.sendEmailNotification(
          recipientProfile.email, senderName, conv.toolName, text
        ).subscribe();
      }
    } catch (e) {
      console.error('Send message failed:', e);
    }

    this.sendingMessage = false;
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      if (diff < 86400000) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  }

  isMyMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUid;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  goBack(): void {
    this.selectedConversation = null;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
