import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainComponent } from '../components/main/main.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { SettingService } from '../../shared/services/setting.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, MainComponent, CommonModule],
  template: `
    <div class="g-sidenav-show body-container  bg-gray-100">
  <app-sidebar></app-sidebar>

  <div [ngClass]="{'full-content': !isFullNav}" class="main-content ">

    <app-main></app-main>
  </div>
</div>
  `,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isFullNav: boolean = true;
  constructor(private setting: SettingService) {

  }
  ngOnInit(): void {
    this.setting.isFullNavbar().subscribe(x => this.isFullNav = x)
  }
}
