import { Component } from '@angular/core';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { OrderService } from 'src/app/Core/Services/order.service';
import { OrderStateFormComponent } from '../SalesRepresentative/order-state-form/order-state-form.component';
import { Order, Order as Order_1 } from 'src/app/Core/Models/Order';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-report',
  templateUrl: './order-report.component.html',
  styleUrls: ['./order-report.component.css'],
})
export class OrderReportComponent {
  orders: any;
  selectedState: string | null = '';
  salesRepresentativeId: any;
  empEmail: any;
  filteredDataOrder: any;
  fromDate: any;
  toDate: any;
  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  selectState(e: any): void {
    this.selectedState = e.target.value === 'All' ? '' : e.target.value;
    this.loadOrders();
  }

  loadOrders(): void {
    this.empEmail = this.authService.getEmail();
    this.orderService
      .getAllOrders(this.empEmail)
      .subscribe((orders: Order[]) => {
        const filteredOrders =
          this.selectedState !== ''
            ? orders.filter((order: any) => order.state === this.selectedState)
            : orders;

        this.orders = this.filteredDataOrder = filteredOrders;
        // this.orders.paginator = this.paginator;
      });
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

  filterOrdersByDateRange() {
    const filteredOrders = this.orders.filter((order: any) => {
      const orderDate = new Date(order.orderDate);
      return (
        (!this.fromDate || orderDate >= new Date(this.fromDate)) &&
        (!this.toDate || orderDate <= new Date(this.toDate))
      );
    });
    this.filteredDataOrder = filteredOrders;
  }

  onFromDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fromDate = target.value;
    this.filterOrdersByDateRange();
  }

  onToDateChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.toDate = target.value;
    this.filterOrdersByDateRange();
  }
  export() {
       const element = document.getElementById('table');
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
       XLSX.writeFile(wb, 'order.xlsx');

  }
}
