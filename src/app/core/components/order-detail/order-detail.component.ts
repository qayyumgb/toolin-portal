import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolService } from '../../../shared/services/tool.service';
import { OrderService } from '../../../shared/services/order.service';
import { orderdetail } from '../../../constant/models/order.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = null;
  orderDetails:orderdetail|null = null
  constructor(private route: ActivatedRoute,  private orderService: OrderService) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => { 
      this.orderId = params.get('id');
      this.orderService.getById(this.orderId).subscribe({
        next: (data) => {
          console.log('order-dertail',data);
          this.orderDetails = data;
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    });
  }
}
