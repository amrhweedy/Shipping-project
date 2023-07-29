import { Component, OnInit, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/Core/Services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrderDetailsComponent>,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.orderService.getOrderById(this.data.orderId).subscribe((data: any) => {
      this.order = data;
    });
  }
  cancel(): void {
    this.dialogRef.close();
  }
  Message() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.panelClass = ['text-center', 'bg-info', 'text-light'];
    this.snackBar.open('Order State Changed successfully!', '', config);
  }
}
