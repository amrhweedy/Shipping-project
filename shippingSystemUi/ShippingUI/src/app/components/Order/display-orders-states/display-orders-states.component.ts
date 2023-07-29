import { Component } from '@angular/core';
import { Order, OrderState } from 'src/app/Core/Models/Order';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { OrderService } from 'src/app/Core/Services/order.service';

@Component({
  selector: 'app-display-orders-states',
  templateUrl: './display-orders-states.component.html',
  styleUrls: ['./display-orders-states.component.css'],
})
export class DisplayOrdersStatesComponent {
  orders: Order[] = [];
  orderStatusCounts: any = {};
  salesRepresentatives: string[] = [];
  empEmail: any;
  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.empEmail = this.authService.getEmail();
    this.orderService.getAllOrders(this.empEmail).subscribe(
      (response: any) => {
        this.orders = response;
        this.orderStatusCounts = {};

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
