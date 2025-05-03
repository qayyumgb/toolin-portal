import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { SettingService } from '../../../shared/services/setting.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  address: string;
  authMethod: string;
  createdAt: string; // or Date, if you plan to convert it to Date objects
  updatedAt: string;
  deletedAt: string | null;
}

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
  profiledetail:User |null = null;
  ngOnInit(): void {
    this.setting.isFullNavbar().subscribe(x => this.showFullNav = x)
    this.setting.getIsMobiel().subscribe(x => this.isMobile = x)
   this.profiledetail = JSON.parse(localStorage.getItem("proifleDetail") || '{}')
   

  }
 firstletter(first:string, last:string):string {
    return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase().toUpperCase()
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
