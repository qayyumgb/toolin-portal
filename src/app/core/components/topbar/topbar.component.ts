import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SettingService } from '../../../shared/services/setting.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { getFirestore } from '../../../shared/services/firebase-init';

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  address: string;
  authMethod: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit, OnDestroy {
  toggleNoties: boolean = false;
  showFullNav: boolean = true;
  isMobile: boolean = false;
  showNotificationDropdown: boolean = false;

  // Notifications
  unreadCount = 0;
  notifications: any[] = [];
  private unsubscribeNotifications: (() => void) | null = null;

  constructor(
    private setting: SettingService,
    private authService: AuthService,
    private route: Router,
    private ngZone: NgZone,
  ) {}

  toggleDropdown(e: Event) {
    e.stopPropagation();
    this.toggleNoties = !this.toggleNoties;
    this.showNotificationDropdown = false;
  }

  toggleNotifications(e: Event) {
    e.stopPropagation();
    this.showNotificationDropdown = !this.showNotificationDropdown;
    this.toggleNoties = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.toggleNoties = false;
    this.showNotificationDropdown = false;
  }

  profiledetail: User | null = null;

  ngOnInit(): void {
    this.setting.isFullNavbar().subscribe(x => this.showFullNav = x);
    this.setting.getIsMobiel().subscribe(x => this.isMobile = x);
    this.profiledetail = JSON.parse(localStorage.getItem('proifleDetail') || '{}');
    this.listenNotifications();
  }

  private listenNotifications(): void {
    const uid = this.profiledetail?.uid || (this.profiledetail as any)?.id;
    if (!uid) return;

    this.unsubscribeNotifications = getFirestore()
      .collection(`users/${uid}/notifications`)
      .where('isSeen', '==', false)
      .orderBy('createdOn', 'desc')
      .limit(20)
      .onSnapshot(snapshot => {
        this.ngZone.run(() => {
          this.notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as any,
          }));
          this.unreadCount = this.notifications.length;
        });
      }, err => {
        console.error('Notification listener error:', err);
      });
  }

  openNotification(n: any): void {
    const uid = this.profiledetail?.uid || (this.profiledetail as any)?.id;
    if (uid && n.id) {
      getFirestore().doc(`users/${uid}/notifications/${n.id}`).update({ isSeen: true });
    }
    this.showNotificationDropdown = false;
    const convId = n.payload?.conversationId;
    this.route.navigate(['/messages'], convId ? { queryParams: { id: convId } } : {});
  }

  formatNotificationTime(timestamp: any): string {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch { return ''; }
  }

  firstletter(first: string, last: string): string {
    return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
  }

  toggleSidebar() {
    this.setting.fullNavbar(!this.showFullNav);
  }

  showSidebar(e: Event) {
    e.stopPropagation();
    this.setting.showInMobile(!this.isMobile);
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    if (this.unsubscribeNotifications) {
      this.unsubscribeNotifications();
    }
  }
}
