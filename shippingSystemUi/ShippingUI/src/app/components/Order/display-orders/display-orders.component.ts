import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { OrderService } from 'src/app/Core/Services/order.service';
import { OrderStateFormComponent } from '../../SalesRepresentative/order-state-form/order-state-form.component';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { Order as Order_1 } from 'src/app/Core/Models/Order';
import { WeightCostPerOrderComponent } from '../weight-cost-per-order/weight-cost-per-order.component';
import { Order } from 'src/app/Core/Models/Permission';
import { AssignOrderToSalesComponent } from '../assign-order-to-sales/assign-order-to-sales.component';

@Component({
  selector: 'app-display-orders',
  templateUrl: './display-orders.component.html',
  styleUrls: ['./display-orders.component.css'],
})
export class DisplayOrdersComponent implements OnInit {
  orders: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedState: string | null = '';
  salesRepresentativeId: any;
  empEmail: any;
  filteredDataOrder: any;
  role: any;

  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private authService: AuthService,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Order.Update);
    this.createPermission = auth.checkPermission(Order.Create);
    this.deletePermission = auth.checkPermission(Order.Delete);
  }

  ngOnInit(): void {
    this.loadOrders();
    this.role = localStorage.getItem('role');
  }

  selectState(e: any): void {
    this.selectedState = e.target.value === 'All' ? '' : e.target.value;
    this.loadOrders();
  }

  loadOrders(): void {
    this.empEmail = this.authService.getEmail();
    this.orderService
      .getAllOrders(this.empEmail)
      .subscribe((orders: Order_1[]) => {
        const filteredOrders =
          this.selectedState !== ''
            ? orders.filter((order: any) => order.state === this.selectedState)
            : orders;

        this.orders = this.filteredDataOrder = filteredOrders;
        this.orders.paginator = this.paginator;
      });
  }

  openOrderStateForm(order: Order_1): void {
    const dialogRef = this.dialog.open(OrderStateFormComponent, {
      data: order,
    });

    dialogRef.afterClosed().subscribe();
  }
  openAssignOrderForm(order: Order_1): void {
    const dialogRef = this.dialog.open(AssignOrderToSalesComponent, {
      data: order,
    });

    dialogRef.afterClosed().subscribe();
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
  openModal(): void {
    const dialogRef = this.dialog.open(WeightCostPerOrderComponent, {});
    dialogRef.afterClosed().subscribe();
  }
}
