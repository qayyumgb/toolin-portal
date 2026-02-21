import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { ToolService } from '../../../shared/services/tool.service';
import { toolsDto } from '../../../constant/models/tools';
@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CarouselModule,CommonModule],
  templateUrl: './tool-detail.component.html',
  styleUrl: './tool-detail.component.scss'
})
export class ToolDetailComponent implements OnInit {
id:any
data:toolsDto | undefined;
  constructor(private route: ActivatedRoute,private toolservice:ToolService) {
    this.route.paramMap.subscribe(params => {
      this.id= params.get('id');
    });
  }
  ngOnInit(): void {
    this.toolservice.getbyId(this.id).subscribe({
      next:x => {
        this.data = x}
    })
  }

  imageList:string[] = [
    "https://randaequipment.com/wp-content/uploads/2024/06/3.jpg",
    "https://image.made-in-china.com/2f0j00NYyqKjizlUgJ/Original-16-Ton-Original-Used-Hitachi-Wheel-Excavator-Ex160wd-with-Best-Engine-and-Pump.jpg",
    'https://massuccot.com/wp-content/uploads/2021/07/ZX-890-7_01.jpg',
    "https://randaequipment.com/wp-content/uploads/2024/06/3.jpg",
    "https://image.made-in-china.com/2f0j00NYyqKjizlUgJ/Original-16-Ton-Original-Used-Hitachi-Wheel-Excavator-Ex160wd-with-Best-Engine-and-Pump.jpg",
    'https://massuccot.com/wp-content/uploads/2021/07/ZX-890-7_01.jpg',
  ]
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin:15,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left"></i>', 
      '<i class="fa fa-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }
  customOptions2: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true, // Autoplay the carousel
    autoplayTimeout: 3000, // Set autoplay interval
    animateOut: 'slideOutUp', // Animation for sliding out
    animateIn: 'slideInDown', // Animation for sliding in
    margin:15,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left"></i>', 
      '<i class="fa fa-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 4
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
  getData(e:any){

  }
  convertTimestamp(timestamp: any): string {
    if (!timestamp) return '';
    if (timestamp.toDate) return timestamp.toDate().toISOString();
    const seconds = timestamp._seconds ?? timestamp.seconds ?? 0;
    const nanoseconds = timestamp._nanoseconds ?? timestamp.nanoseconds ?? 0;
    const date = new Date(seconds * 1000 + nanoseconds / 1_000_000);
    return date.toISOString();
  }
}
