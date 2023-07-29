import { Router } from '@angular/router';
import { CityService } from './../../../Core/Services/city.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { PaymentType, ShippingType } from 'src/app/Core/Models/Order';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { BranchService } from 'src/app/Core/Services/branch.service';
import { GovermentService } from 'src/app/Core/Services/goverment.service';
import { OrderService } from 'src/app/Core/Services/order.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css'],
})
export class AddOrderComponent implements OnInit {
  rows: any[] = [];
  orderForm!: FormGroup;
  governments: string = '';
  cities: string[] = [];
  selectedGovernment: string = '';
  selectedCity = false;
  shippingTypes: any[] = [];
  paymentMethods: string[] = [];
  branches: string[] = [];
  email: any;
  productsFormArray: any;
  weightOption = {};
  traderEmail: any;
  orders: any;
  totalcost: any;
  totalweight: any;
  error!: string;

  constructor(
    private cityService: CityService,
    private governmentService: GovermentService,
    private branchService: BranchService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // private dialogRef: MatDialogRef<AddOrderComponent>
  ) {
    this.shippingTypes = Object.keys(ShippingType).filter((key) =>
      isNaN(Number(key))
    );
    this.paymentMethods = Object.keys(PaymentType).filter((key) =>
      isNaN(Number(key))
    );
  }

  ngOnInit(): void {
    this.orderForm = new FormGroup({
      villageDeliverd: new FormControl(false),
      deliverToVillageCost: new FormControl(''),
      shippingType: new FormControl('', Validators.required),
      paymentType: new FormControl('', Validators.required),
      branch: new FormControl('', Validators.required),
      products: new FormArray([], Validators.required),
      totalcost: new FormControl('', Validators.required),
      totalweight: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      government: new FormControl('', Validators.required),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      village: new FormControl(''),
      phone1: new FormControl('', Validators.required),
      phone2: new FormControl('', Validators.required),
    });

    this.weightOption = this.orderService.getWeightOptions();
    console.log(this.weightOption);
    this.getGovernments();
    this.getBranches();
    this.subscribeToProductChanges();
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  AddOrder(): void {
    const role = localStorage.getItem('role');
    const formData = this.orderForm.value;
    this.email = this.authService.getEmail();
    console.log(this.email);
    const orderData = {
      paymentMethod: PaymentType[formData.paymentType],
      orderDate: new Date().toISOString(),
      shippingType: ShippingType[formData.shippingType],
      companyBranch: formData.branch,
      weightOption: this.weightOption,
      totalCost: this.totalcost,
      totalWeight: this.totalweight,
      deliverToVillageCost: parseInt(formData.deliverToVillageCost),
      deliveredToVillage: formData.villageDeliverd,
      customer: {
        email: formData.email,
        name: formData.name,
        goverment: formData.government,
        city: formData.city,
        village: formData.village,
        phone1: formData.phone1,
        phone2: formData.phone2,
      },
      products: formData.products.map((product: any) => ({
        productName: product.productName,
        weight: product.weight,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    this.orderService.addOrder(orderData, this.email).subscribe(
      (response: any) => {
        this.router.navigate(['/home/order/list/trader']);
        Swal.fire({
          title: 'Order has been successfully Added!',
          icon: 'success',
          confirmButtonColor: '#00b2ff',
        });
        this.loadOrders();
      },
      (error) => {
        Swal.fire({
          title: 'Invalid Inputs, Please Enter Valid Order.',
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
    );
  }

  loadOrders(): void {
    this.email = this.authService.getEmail();
    this.orderService.getAllOrders(this.email).subscribe((orders: any) => {
      console.log(orders);

      if (orders) {
        const filteredOrders = orders.filter((order: any) => !order.isDeleted);
        this.orders = filteredOrders;
      }
    });
  }
  subscribeToProductChanges() {
    const productsFormArray = this.orderForm.get('products') as FormArray;

    productsFormArray.valueChanges.subscribe((products) => {
      this.totalcost = 0;
      this.totalweight = 0;

      products.forEach((product: any) => {
        const price = parseInt(product.price);
        const quantity = parseInt(product.quantity);
        const weight = parseInt(product.weight);

        if (!isNaN(price) && !isNaN(quantity)) {
          this.totalcost += price * quantity;
        }

        if (!isNaN(weight) && !isNaN(quantity)) {
          this.totalweight += weight * quantity;
        }
      });

      this.orderForm.patchValue({
        totalcost: this.totalcost,
        totalweight: this.totalweight,
      });
    });
  }
  addRow() {
    const productFormGroup = new FormGroup({
      productName: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
    });
    this.rows.push(productFormGroup);
    this.products.push(productFormGroup);
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
  }

  onGovernmentChange(event: any): void {
    this.selectedGovernment = event.target.value;
    const cityControl = this.orderForm.get('city');

    if (this.selectedGovernment) {
      cityControl?.enable();
    } else {
      cityControl?.disable();
    }
    this.getCities(this.selectedGovernment);
  }

  isCityDisabled(): boolean {
    const governmentControl = this.orderForm.get('government');
    return governmentControl?.value === '';
  }
  onVillageDeliveryToggle(event: any) {
    const isChecked = event.checked;
    this.orderForm.get('villageDeliverd')?.setValue(isChecked);
    console.log(isChecked);
  }
  getGovernments(): void {
    this.governmentService.GetAllGovernment().subscribe((data: any) => {
      this.governments = data.map((item: any) => item.govermentName);
    });
  }

  getCities(government: string) {
    this.cityService
      .getCitiesByGovernment(government)
      .subscribe((data: any) => {
        this.cities = data.map((item: any) => item.cityName);
      });
  }
  getBranches(): void {
    this.branchService.getAllBranches().subscribe((data: any) => {
      this.branches = data.map((item: any) => item.branchName);
    });
  }
  Message() {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.panelClass = ['text-center', 'bg-info', 'text-light'];
    this.snackBar.open('Order added successfully!', '', config);
  }
}
