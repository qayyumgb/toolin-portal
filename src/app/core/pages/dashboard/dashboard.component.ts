import { Component } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/component/progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
imports: [ProgressBarComponent, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 counter:any = [
  {
    title:"Today Earning",
    count:"53,000",
    updown:55,
    icon:'fa-money-bill-1-wave'
  },
  {
    title:"Total Earning",
    count:"2,300",
    updown:55,
    icon:'fa-globe'
  },
  {
    title:"Today Sales",
    count:"+5000",
    updown:-2,
    icon:'fa-user-plus '
  },
  {
    title:"Total Sales",
    count:"153,000",
    updown:5,
    icon:'fa-cart-plus'
  },
 ]
}
