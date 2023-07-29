import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/Core/Models/Branch';
import { Goverment } from 'src/app/Core/Models/Goverment';
import { Sales } from 'src/app/Core/Models/Permission';
import { SalesRepresentator } from 'src/app/Core/Models/Sales';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { BranchService } from 'src/app/Core/Services/branch.service';
import { GovermentService } from 'src/app/Core/Services/goverment.service';
import { SalesService } from 'src/app/Core/Services/sales.service';
import Swal from 'sweetalert2';

declare var window: any;

@Component({
  selector: 'app-display-sales',
  templateUrl: './display-sales.component.html',
  styleUrls: ['./display-sales.component.css'],
})
export default class DisplaySalesComponent implements OnInit {
  sales: SalesRepresentator[] = [];
  filteredData: SalesRepresentator[] = [];
  branches: Branch[] = [];
  governments: Goverment[] = [];
  $pageSize = 5;
  $totalItems = 0;
  $page = 1;
  id!: number;
  allowEdit = false;
  salesId!: number;

  salesForm!: FormGroup;
  formModel: any;

  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private salesservice: SalesService,
    private branchservice: BranchService,
    private GovermentService: GovermentService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Sales.Update);
    this.createPermission = auth.checkPermission(Sales.Create);
    this.deletePermission = auth.checkPermission(Sales.Delete);
  }

  ngOnInit(): void {
    this.salesservice
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.sales = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });
    this.branchservice.getAllBranches().subscribe((data: any) => {
      this.branches = data;
    });
    this.GovermentService.GetAllGovernment().subscribe((data: any) => {
      this.governments = data;
    });

    this.salesForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      userName: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
      ]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/01[0125][0-9]{8}$/),
      ]),
      address: new FormControl(null, Validators.required),
      companyPercentage: new FormControl(null, Validators.required),
      discountType: new FormControl<number>(0, Validators.required),
      governmentsIds: new FormControl(null, Validators.required),
      branchesIds: new FormControl(null, Validators.required),
    });
  }
  loadData() {
    this.salesservice.getAllSales().subscribe((data: any) => {
      this.sales = this.filteredData = data;
    });
  }
  addSalesRepresentator() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  deleteSales(id: number) {
    //
    Swal.fire({
      title: 'Are you sure you would like to delete?',
      icon: 'warning',
      iconColor: '#FFC700',
      showCancelButton: true,
      confirmButtonText: 'Yes, delet it!',
      confirmButtonColor: '#00b2ff',
      cancelButtonText: 'No, return',
      width: '416px',
      cancelButtonColor: '#eff2f5',
    }).then((result) => {
      if (result.value) {
        this.salesservice.deleteSales(id).subscribe(
          (data: any) => {
            Swal.fire({
              title: 'Deleted successfully!',
              icon: 'success',
              confirmButtonColor: '#00b2ff',
            });
            this.loadData();
          },
          (error) => {
            Swal.fire({
              title: 'Employee has not been deleted!.',
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

            console.log(error.message);
          }
        );
      } else {
        Swal.fire({
          title: 'Employee has not been deleted!.',
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
  }

  onOptionSelected(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue.startsWith('edit/')) {
      const salesId = selectedValue.substr(5);
      this.allowEdit = true;
      this.openModal(salesId);
    } else {
      this.deleteSales(selectedValue);
    }
    event.target.value = 'action';
  }

  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();

    return this.sales.filter((item) => {
      const itemName = item.name?.toLowerCase();

      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }

  // Modal

  onsubmit() {
    if (!this.allowEdit) {
      this.salesservice
        .addSalesRepresentator({
          ...this.salesForm.value,
          isActive: true,
          discountType: Number(this.salesForm.get('discountType')?.value),
        })
        .subscribe(
          (data: any) => {
            Swal.fire({
              title: 'Form has been successfully submitted!',
              icon: 'success',
              confirmButtonColor: '#00b2ff',
              width: '416px',
            });
            this.formModel = document.getElementById('salesModel');
            this.formModel.classList.remove('show');
            this.formModel.style.display = 'none';
            document.body.classList.remove('modal-open');
            this.loadData();
          },
          (error) => {
            alert('error !!!');
            console.log(error);
          }
        );
    } else {
      this.onEdit();
    }
  }

  openModal(id: any) {
    if (!id) {
      this.allowEdit = false;
    } else {
      this.getData(id);
      this.salesId = id;
    }
    this.formModel = document.getElementById('salesModel');
    this.formModel.classList.add('show');
    this.formModel.style.display = 'block';
    document.body.classList.add('modal-open');
  }

  getPaginatedData(index: any) {
    this.salesservice
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.sales = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });
  }

  close() {
    Swal.fire({
      title: 'Are you sure you would like to cancel?',
      icon: 'warning',
      iconColor: '#FFC700',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      confirmButtonColor: '#00b2ff',
      cancelButtonText: 'No, return',
      width: '416px',
      cancelButtonColor: '#eff2f5',
    }).then((result) => {
      if (result.value) {
        this.formModel = document.getElementById('salesModel');
        this.formModel.classList.remove('show');
        this.formModel.style.display = 'none';
        document.body.classList.remove('modal-open');
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
  }

  // Edit
  onEdit() {
    this.salesservice
      .updateSalesRepresentator(this.salesId, {
        ...this.salesForm.value,
        salesRepresentativeId: this.salesId,
        discountType: Number(this.salesForm.get('discountType')?.value),
      })
      .subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            width: '416px',
            confirmButtonColor: '#00b2ff',
          });
          this.formModel = document.getElementById('salesModel');
          this.formModel.classList.remove('show');
          this.formModel.style.display = 'none';
          document.body.classList.remove('modal-open');
          this.loadData();
        },
        (error) => {
          alert('error !!!');
          console.log(error);
        }
      );
  }

  getData(id: any) {
    this.salesservice.getSalesByID(id).subscribe((data: SalesRepresentator) => {
      console.log(data);

      this.salesForm.setValue({
        name: data.name,
        userName: data.userName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        address: data.address,
        companyPercentage: data.companyPercentage,
        discountType: data.discountType?.toString(),
        governmentsIds: data.goverments?.map((item) => {
          return item.goverment_Id;
        }),
        branchesIds: data.branches?.map((item) => {
          return item.id;
        }),
      });
    });
  }
}
