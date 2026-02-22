import { Injectable, NgZone } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getFirestore, firebase, waitForAuth } from './firebase-init';

export interface Conversation {
  id?: string;
  buyerId: string;
  sellerId: string;
  toolId: string;
  toolName: string;
  toolImage: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: any;
  createdAt: any;
  otherUserName?: string;
  otherUserEmail?: string;
}

export interface ChatMessage {
  id?: string;
  senderId: string;
  text: string;
  createdAt: any;
  read: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private get db() { return getFirestore(); }

  constructor(private ngZone: NgZone) {}

  private getProfile(): any {
    try {
      return JSON.parse(localStorage.getItem('proifleDetail') || '{}');
    } catch { return {}; }
  }

  getMyConversations(uid: string): Observable<Conversation[]> {
    return new Observable<Conversation[]>(subscriber => {
      const unsubscribe = this.db.collection('conversations')
        .where('participants', 'array-contains', uid)
        .orderBy('lastMessageAt', 'desc')
        .onSnapshot(
          snapshot => {
            this.ngZone.run(() => {
              const conversations = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
              })) as Conversation[];
              subscriber.next(conversations);
            });
          },
          err => {
            this.ngZone.run(() => subscriber.error(err));
          }
        );
      return () => unsubscribe();
    });
  }

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    return new Observable<ChatMessage[]>(subscriber => {
      const unsubscribe = this.db
        .collection(`conversations/${conversationId}/messages`)
        .orderBy('createdAt', 'asc')
        .onSnapshot(
          snapshot => {
            this.ngZone.run(() => {
              const messages = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
              })) as ChatMessage[];
              subscriber.next(messages);
            });
          },
          err => {
            this.ngZone.run(() => subscriber.error(err));
          }
        );
      return () => unsubscribe();
    });
  }

  sendMessage(conversationId: string, senderId: string, text: string): Observable<void> {
    return from(waitForAuth()).pipe(
      switchMap(() => {
        const batch = this.db.batch();
        const msgRef = this.db
          .collection(`conversations/${conversationId}/messages`)
          .doc();
        batch.set(msgRef, {
          senderId,
          text,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          read: false,
        });
        const convRef = this.db.collection('conversations').doc(conversationId);
        batch.update(convRef, {
          lastMessage: text,
          lastMessageAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return from(batch.commit());
      })
    );
  }

  sendNotification(
    recipientUid: string,
    payload: { conversationId: string; toolId: string; toolName: string; senderName: string }
  ): Observable<void> {
    const notification = {
      content: `New message from ${payload.senderName} about ${payload.toolName}`,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      isSeen: false,
      type: 'NEW_CHAT_MESSAGE',
      payload,
    };
    return from(
      this.db.collection(`users/${recipientUid}/notifications`).add(notification).then(() => {})
    );
  }

  sendEmailNotification(
    recipientEmail: string,
    senderName: string,
    toolName: string,
    messageText: string
  ): Observable<void> {
    const mailDoc = {
      to: recipientEmail,
      message: {
        subject: `New message from ${senderName} about "${toolName}" on Toolin`,
        html: `<p><strong>${senderName}</strong> sent you a message about <strong>${toolName}</strong>:</p>
               <blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">${messageText}</blockquote>
               <p>Log in to Toolin to reply.</p>`,
      },
    };
    return from(this.db.collection('mail').add(mailDoc).then(() => {}));
  }

  getUserProfile(uid: string): Observable<any> {
    return from(this.db.collection('users').doc(uid).get()).pipe(
      map(doc => doc.exists ? { id: doc.id, ...doc.data() } : null)
    );
  }
}
