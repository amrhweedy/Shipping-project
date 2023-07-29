import { ViewChild, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Order } from 'src/app/Core/Models/Order';
import { OrderService } from 'src/app/Core/Services/order.service';
import { AuthService } from 'src/app/Core/Services/auth.service';

import { OrderDetailsComponent } from '../../order-details/order-details.component';
import { AddOrderComponent } from '../add-order/add-order.component';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-display-Trader',
  templateUrl: './order-display-Trader.component.html',
  styleUrls: ['./order-display-Trader.component.css'],
})
export class OrderDispalyTraderComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages!: number;
  pages!: number[];
  email: any;
  orders: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedState: string | null = '';
  filteredDataOrder: any;
  role: any;
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.role = localStorage.getItem('role');
  }
  openDetails(order: any): void {
    const dialogRef = this.dialog.open(OrderDetailsComponent, {
      data: order,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  selectState(e: any): void {
    this.selectedState = e.target.value === 'All' ? '' : e.target.value;
    this.loadOrders();
  }

  loadOrders(): void {
    this.email = this.authService.getEmail();
    this.orderService.getAllOrders(this.email).subscribe((orders: any) => {
      console.log(orders);

      if (orders) {
        const filteredOrders = orders.filter((order: any) => !order.isDeleted);
        if (this.selectedState !== '') {
          const filteredOrdersByState = filteredOrders.filter(
            (order: any) => order.state === this.selectedState
          );
          this.orders = this.filteredDataOrder = filteredOrdersByState;
        } else {
          this.orders = this.filteredDataOrder = filteredOrders;
        }

        this.orders.paginator = this.paginator;
      }
    });
  }

  deleteOrder(orderId: number) {
    Swal.fire({
      title: 'Are you sure you would like to delete this order?',
      icon: 'warning',
      iconColor: '#FFC700',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      confirmButtonColor: '#00b2ff',
      cancelButtonText: 'No, return',
      width: '416px',
      cancelButtonColor: '#eff2f5',
    }).then((result) => {
      if (result) {
        this.orderService
          .deleteOrderForTrader(orderId)
          .subscribe((response: any) => {
            this.loadOrders();
            Swal.fire({
              title: 'Order has been successfully Deleted!',
              icon: 'success',
              confirmButtonColor: '#00b2ff',
            });
          });
      } else {
        Swal.fire({
          title: 'Your form has not been cancelled!.',
          icon: 'error',
          confirmButtonText: 'Ok, got it!',
          confirmButtonColor: '#00b2ff',
          width: '416px',
          iconColor: '#F1416C',
          customClass: {
            icon: 'custom-cancel-icon',
            title: 'custom-content-class',
          },
        });
      }
    });
    this.loadOrders();
  }

  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();

    return this.orders.filter((item: any) => {
      const itemName = item.customer?.goverment.toLowerCase();
      console.log(itemName);
      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    console.log(inputValue);
    this.filteredDataOrder = this.filterData(inputValue);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange() {
    this.currentPage = 1;
  }

  selectStatePagination(state: string) {
    this.selectedState = state;
    this.currentPage = 1;
  }
}
