import { Component } from '@angular/core';
import { OrderListComponent } from '../../components/order-list/order-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [OrderListComponent, RouterOutlet],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

}
