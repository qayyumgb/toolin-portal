import { Component, inject, OnInit } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/component/progress-bar/progress-bar.component';
import { Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { orderDto, orderReturnDto } from '../../../constant/models/order.dto';
import { UtilityService } from '../../../shared/utilities/utility';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [ProgressBarComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
private router = inject(Router)
protected util = inject(UtilityService)
orderData:orderReturnDto | undefined
constructor(private orderServices: OrderService){}
  ngOnInit(): void {
    this.orderServices.getAll().subscribe({
      next:(x:orderReturnDto) => {
        this.orderData = x;
        console.log(this.orderData);
        
      }
       
    })
  }

gotoDetail(){
  this.router.navigate(['order/details'])
}
orderProgress: any = [
{
  title: "All Orders",
  icon: "fa-cart-plus",
  color: "primary",
},
{
  title: "Pending",
  icon: "fa-clock-o",
  color: "warning",
},
{
  title: "Canceled",
  icon: "fa-times-circle",
  color: "danger",
},
{
  title: "Refunded",
  icon: "fa-undo",
  color: "info",
},
{
  title: "Paid",
  icon: "fa-check-circle",
  color: "success",
},
{
  title: "In Progress",
  icon: "fa-refresh",
  color: "info",
},


]
  orderList: any = [
    {
      id: "#10421",
      date: "1 Nov, 10:20 AM",
      status: "Approved",
      name: "Orlando Imieto",
      product: "Nike Sport V2",
      revenue: "$140,20"
    }, {
      id: "#10422",
      date: "1 Nov, 10:53 AM",
      status: "Approved",
      name: "Alice Murinho",
      product: "Valvet T-shirt",
      revenue: "$42,00"
    }, {
      id: "#10423",
      date: "1 Nov, 11:13 AM",
      status: "Pending",
      name: "Michael Mirra",
      product: "Leather Wallet +1 more",
      revenue: "$25,50"
    }, {
      id: "#10424",
      date: "1 Nov, 12:20 PM",
      status: "Approved",
      name: "Andrew Nichel",
      product: "Bracelet Onu-Lino",
      revenue: "$19,40"
    }, {
      id: "#10425",
      date: "1 Nov, 1:40 PM",
      status: "Canceled",
      name: "Sebastian Koga",
      product: "Phone Case Pink x 2",
      revenue: "$44,90"
    }, {
      id: "#10426",
      date: "1 Nov, 2:19 AM",
      status: "Approved",
      name: "Laur Gilbert",
      product: "Backpack Niver",
      revenue: "$112,50"
    }, {
      id: "#10427",
      date: "1 Nov, 3:42 AM",
      status: "Approved",
      name: "Iryna Innda",
      product: "Adidas Vio",
      revenue: "$200,00"
    }
  ]
}
