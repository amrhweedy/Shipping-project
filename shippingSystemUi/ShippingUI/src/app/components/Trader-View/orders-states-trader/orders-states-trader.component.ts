import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Core/Models/Order';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { OrderService } from 'src/app/Core/Services/order.service';

@Component({
  selector: 'app-orders-states-trader',
  templateUrl: './orders-states-trader.component.html',
  styleUrls: ['./orders-states-trader.component.css'],
})
export class OrdersStatesTraderComponent implements OnInit {
  orders: Order[] = [];
  orderStatusCounts: any = {};
  email = '';
  traderId: any;
  traderEmail: any;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.traderEmail = this.authService.getEmail();
    this.orderService.getAllOrders(this.traderEmail).subscribe(
      (response: any) => {
        this.orders = response;
        this.orderStatusCounts = {};
        if (this.orders) {
          const filteredOrders = this.orders.filter(
            (order: any) => !order.isDeleted
          );
          filteredOrders.forEach((order: any) => {
            const stateName = this.getStatusName(order.state);

            if (stateName) {
              if (this.orderStatusCounts[stateName]) {
                this.orderStatusCounts[stateName]++;
              } else {
                this.orderStatusCounts[stateName] = 1;
              }
            }
          });
        }

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
