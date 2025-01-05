import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
isFullNavbar:boolean = true;
currentUrl: string = '';
profileData:profileDto = JSON.parse(localStorage.getItem("proifleDetail") || '{}')
currentRoute: any;

  constructor(private setting: SettingService,private router: Router,private activatedRoute: ActivatedRoute){

  }
  ngOnInit(): void {
    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
      console.log(this.currentRoute);
      
    });
    this.setting.isFullNavbar().subscribe((x) => this.isFullNavbar = x)
  }

 
navList:any = [
  {
    title:"Dashboard",
    route:"/",
    icon:"fa-dashboard",
    role:"none"
  },
  {
    title:"Tools",
    route:"/tools",
    icon:"fa-truck",
    role:"none"
  },
  {
    title:"Order",
    route:"/order",
    icon:"fa-shopping-bag",
    role:"none"
  },
  
  {
    title:"Category",
    route:"/cateogry",
    icon:"fa-tags",
    role:"Admin"
  },
  {
    title:"User",
    route:"/user",
    icon:"fa-user",
    role:"Admin"
  },
]
}
