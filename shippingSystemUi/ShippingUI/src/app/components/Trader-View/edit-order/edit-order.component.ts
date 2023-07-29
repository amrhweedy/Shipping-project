import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ShippingType, PaymentType } from 'src/app/Core/Models/Order';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { BranchService } from 'src/app/Core/Services/branch.service';
import { CityService } from 'src/app/Core/Services/city.service';
import { GovermentService } from 'src/app/Core/Services/goverment.service';
import { OrderService } from 'src/app/Core/Services/order.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})
export class EditOrderComponent implements OnInit {
  rows: any[] = [];
  orderForm!: FormGroup;
  governments: string = '';
  cities: string[] = [];
  selectedGovernment: string = '';
  selectedCity = false;
  shippingTypes: string[] = [];
  paymentMethods: string[] = [];
  branches: string[] = [];
  email: any;
  products: any;
  productsFormArray: any;
  order: any;
  weightOption: any;
  traderEmail: any;
  orders: any;
  id: any;
  constructor(
    private cityService: CityService,
    private governmentService: GovermentService,
    private branchService: BranchService,
    private orderService: OrderService,
    private authService: AuthService,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router // private dialogRef: MatDialogRef<EditOrderComponent>
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
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      government: new FormControl('', Validators.required),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      village: new FormControl(''),
      phone1: new FormControl('', Validators.required),
      phone2: new FormControl('', Validators.required),
    });
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.getGovernments();
    this.getBranches();
    this.subscribeToProductChanges();
    this.fetchOrderData();
    this.weightOption = this.orderService.getWeightOptions();
    console.log(this.weightOption);
    this.productsFormArray = this.orderForm.get('products') as FormArray;
  }

  populateFormWithSelectedOrder(order: any): void {
    const products = this.orderForm.get('products') as FormArray;

    order.products.forEach((product: any) => {
      const productFormGroup = new FormGroup({
        productName: new FormControl(product.productName || ''),
        quantity: new FormControl(product.quantity || ''),
        price: new FormControl(product.price || ''),
        weight: new FormControl(product.weight || ''),
      });
      products.push(productFormGroup);
      this.rows.push(productFormGroup);
    });

    this.orderForm.patchValue({
      name: order.customer.name,
      email: order.customer.email,
      government: order.customer.goverment,
      city: order.customer.city,
      village: order?.customer.village,
      phone1: order?.customer.phone1,
      phone2: order?.customer.phone2,
      shippingType: order?.shippingType,
      paymentMethod: order?.paymentMethod,
      branch: order?.companyBranch,
      totalcost: order?.totalCost,
      totalweight: order?.totalWeight,
    });
  }
  UpdateOrder(): void {
    const role = localStorage.getItem('role');
    const formData = this.orderForm.value;
    const orderData = {
      state: 'New',
      orderDate: new Date().toISOString(),
      totalCost: formData.totalcost,
      totalWeight: formData.totalweight,
      paymentMethod: formData.paymentMethod,
      extraWeightCost: this.weightOption.costPerKG,
      companyBranch: formData.branch,
      defaultCost: this.weightOption.costPerKG,
      shippingType: formData.shippingType,
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
      isDeleted: false,
      products: formData.products.map((product: any) => ({
        productName: product.productName,
        weight: parseInt(product.weight),
        price: parseInt(product.price),
        quantity: product.quantity,
      })),
    };
    console.log(orderData);
    this.email = this.authService.getEmail();
    this.orderService.updateOrder(this.order.orderId, orderData).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Order has been successfully Updated!',
          icon: 'success',
          confirmButtonColor: '#00b2ff',
        });
        this.loadOrders();
        this.router.navigate(['/home/order/list/trader']);
      },
      (error: any) => {
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
  fetchOrderData() {
    this.orderService.getOrderById(this.id).subscribe((order: any) => {
      this.order = order;
      console.log(this.order);
      this.populateFormWithSelectedOrder(this.order);
    });
  }

  addRow() {
    const productFormGroup = new FormGroup({
      productName: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
    });
    this.productsFormArray.push(productFormGroup);
    this.rows.push(productFormGroup);
  }

  subscribeToProductChanges() {
    const productsFormArray = this.orderForm.get('products') as FormArray;

    productsFormArray.valueChanges.subscribe((products) => {
      let totalcost = 0;
      let totalweight = 0;

      products.forEach((product: any) => {
        const price = parseInt(product.price);
        const quantity = parseInt(product.quantity);
        const weight = parseInt(product.weight);

        if (!isNaN(price) && !isNaN(quantity)) {
          totalcost += price * quantity;
        }

        if (!isNaN(weight) && !isNaN(quantity)) {
          totalweight += weight * quantity;
        }
      });

      this.orderForm.patchValue({
        totalcost: totalcost,
        totalweight: totalweight,
      });
    });
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
    this.snackBar.open('Order updated successfully!', '', config);
  }
}
