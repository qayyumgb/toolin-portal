import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { SettingService } from '../../../shared/services/setting.service';
import { filter } from 'rxjs';
import { profileDto } from '../../../constant/models/login.dto';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isFullNavbar: boolean = true;
  showMobileSide: boolean = false;
  currentUrl: string = '';
  profileData: profileDto = JSON.parse(localStorage.getItem("proifleDetail") || '{}')
  currentRoute: any;

  constructor(private setting: SettingService, private eRef: ElementRef, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;

      });
    this.setting.isFullNavbar().subscribe((x) => {
      if (window.innerWidth > 1024) {
        this.isFullNavbar = x
      }else{
        this.isFullNavbar = true;

      }
    })
    this.setting.getIsMobiel().subscribe((x) => {
      if (window.innerWidth <1024) {
        this.showMobileSide = x
      }
    })
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (window.innerWidth < 1024 ) {
      this.setting.showInMobile(false);
    }
  }

  navList: any = [
    {
      title: "Dashboard",
      route: "/",
      icon: "fa-dashboard",
      role: "none"
    },
    {
      title: "Tools",
      route: "/tools",
      icon: "fa-truck",
      role: "none"
    },
    {
      title: "Order",
      route: "/order",
      icon: "fa-shopping-bag",
      role: "none"
    },

    {
      title: "Category",
      route: "/cateogry",
      icon: "fa-tags",
      role: "Admin"
    },
    {
      title: "User",
      route: "/user",
      icon: "fa-user",
      role: "Admin"
    },
  ]
}
