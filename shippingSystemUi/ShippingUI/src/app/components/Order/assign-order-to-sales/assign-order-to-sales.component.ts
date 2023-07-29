import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { OrderState } from 'src/app/Core/Models/Order';
import { OrderService } from 'src/app/Core/Services/order.service';
import { OrderStateFormComponent } from '../../SalesRepresentative/order-state-form/order-state-form.component';
import { SalesService } from 'src/app/Core/Services/sales.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-order-to-sales',
  templateUrl: './assign-order-to-sales.component.html',
  styleUrls: ['./assign-order-to-sales.component.css'],
})
export class AssignOrderToSalesComponent {
  salesList: any[] = [];
  selectedSalesId: number | null = null;
  assignOrderForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AssignOrderToSalesComponent>,
    private orderService: OrderService,
    private salesService: SalesService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.assignOrderForm = this.formBuilder.group({
      salesId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSalesList();
  }
  loadSalesList() {
    this.salesService.getAllSales().subscribe(
      (data: any) => {
        this.salesList = data;
      },
      (error: any) => {
        console.error('Error fetching sales list:', error);
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }

  Assign(): void {
    const salesId = this.assignOrderForm.value.salesId;
    console.log(salesId);
    console.log(this.data.orderId);

    this.salesService.assignOrderToSales(salesId, this.data.orderId).subscribe(
      (data: any) => {
        this.Message();
        this.dialogRef.close();
      },
      (error: any) => {
        console.error('Error assigning order:', error);
      }
    );
  }

  Message() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.panelClass = ['text-center', 'bg-info', 'text-light'];
    this.snackBar.open('Order is assigned successfully!', '', config);
  }
}
