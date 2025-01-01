import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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


  constructor(private setting: SettingService, private authService: AuthService,private route:Router) {

  }
  ngOnInit(): void {
    this.setting.isFullNavbar().subscribe(x => this.showFullNav = x)
  }

  toggleSidebar() {
    this.setting.fullNavbar(!this.showFullNav)
  }
  logout() {
    this.authService.logout();
this.route.navigate(['/auth'])
  }
}
