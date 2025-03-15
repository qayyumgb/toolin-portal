import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { SettingService } from '../../../shared/services/setting.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  toggleNoties: boolean = false;
  showFullNav: boolean = true;
  isMobile: boolean = false;


  constructor(private setting: SettingService, private authService: AuthService, private route: Router) {

  }
toggleDropdown(e:Event){
  e.stopPropagation();
  this.toggleNoties = !this.toggleNoties;
}


 @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
   this.toggleNoties = false;
  }

  ngOnInit(): void {
    this.setting.isFullNavbar().subscribe(x => this.showFullNav = x)
    this.setting.getIsMobiel().subscribe(x => this.isMobile = x)
  }

  toggleSidebar() {
    this.setting.fullNavbar(!this.showFullNav)
  }
  showSidebar(e:Event) {
    e.stopPropagation()
    this.setting.showInMobile(!this.isMobile)
  }
  logout() {
    this.authService.logout();
    this.route.navigate(['/auth'])
  }
}
