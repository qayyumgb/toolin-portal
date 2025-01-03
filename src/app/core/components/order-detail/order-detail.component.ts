import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolService } from '../../../shared/services/tool.service';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  orderId: string | null = null;
  constructor(private route: ActivatedRoute,  private orderService: OrderService) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {debugger
      this.orderId = params.get('id');
      this.orderService.getById(this.orderId).subscribe({
        next: (data) => {
          console.log('order-dertail',data);
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    });
  }
}
