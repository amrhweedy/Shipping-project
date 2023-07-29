import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Core/Models/Order';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { OrderService } from 'src/app/Core/Services/order.service';

@Component({
  selector: 'app-orders-states',
  templateUrl: './orders-states.component.html',
  styleUrls: ['./orders-states.component.css'],
})
export class OrdersStatesComponent implements OnInit {
  orders: Order[] = [];
  orderStatusCounts: any = {};
  salesEmail: any;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.salesEmail = this.authService.getEmail();
    this.orderService.getAllOrders(this.salesEmail).subscribe(
      (response: any) => {
        this.orders = response;
        this.orderStatusCounts = {};
        console.log(this.orders);

        this.orders.forEach((order: any) => {
          const stateName = this.getStatusName(order.state);

          if (stateName) {
            if (this.orderStatusCounts[stateName]) {
              this.orderStatusCounts[stateName]++;
            } else {
              this.orderStatusCounts[stateName] = 1;
            }
          }
        });
      },
      (error: any) => {
        console.error('Error retrieving orders:', error);
      }
    );
  }

  getStatusName(statusValue: any): string {
    return statusValue;
  }
}
