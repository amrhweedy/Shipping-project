import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/Core/Services/order.service';

@Component({
  selector: 'app-weight-cost-per-order',
  templateUrl: './weight-cost-per-order.component.html',
  styleUrls: ['./weight-cost-per-order.component.css'],
})
export class WeightCostPerOrderComponent implements OnInit {
  weightForm!: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<WeightCostPerOrderComponent>,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.weightForm = this.formBuilder.group({
      weight: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  AddWeightOptions(): void {
    if (this.weightForm.invalid) {
      return;
    }
    const weight = this.weightForm.value.weight;
    const cost = this.weightForm.value.cost;
    console.log(this.weightForm.value);
    this.orderService.AddWeightOptions(weight, cost);
    this.Message();
    this.dialogRef.close();
  }

  Message() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.panelClass = ['text-center', 'bg-info', 'text-light'];
    this.snackBar.open('Weight Options Added successfully!', '', config);
  }
}
