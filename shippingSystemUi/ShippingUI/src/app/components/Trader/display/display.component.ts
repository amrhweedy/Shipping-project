import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Branch } from 'src/app/Core/Models/Branch';
import { Trader as Trader_1 } from 'src/app/Core/Models/Trader';

import { Trader } from 'src/app/Core/Models/Permission';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { BranchService } from 'src/app/Core/Services/branch.service';
import { TraderService } from 'src/app/Core/Services/trader.service';
import Swal from 'sweetalert2';

declare var window: any;

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayTraderComponent implements OnInit {
  traders: Trader_1[] = [];
  filteredData: Trader_1[] = [];
  Id!: number;
  branchesArray!: Branch[];
  formModel: any;
  traderForm!: FormGroup;
  allowEdit = false;
  traderId!: number;

  $pageSize = 5;
  $totalItems = 0;
  $page = 1;

  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private traderservice: TraderService,
    private router: Router,
    private route: ActivatedRoute,
    private branchservice: BranchService,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Trader.Update);
    this.createPermission = auth.checkPermission(Trader.Create);
    this.deletePermission = auth.checkPermission(Trader.Delete);
  }

  ngOnInit(): void {
    this.traderservice
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.traders = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });

    this.branchservice.getAllBranches().subscribe((data: any) => {
      this.branchesArray = data;
    });

    this.traderForm = new FormGroup({
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
      address: new FormControl(null, Validators.required),

      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/01[0125][0-9]{8}$/),
      ]),
      costPerRefusedOrder: new FormControl(null, Validators.required),
      companyBranch: new FormControl(null, Validators.required),
    });
  }
  loadData() {
    this.traderservice.GetAllTraders().subscribe((data: any) => {
      this.traders = this.filteredData = data;
    });
  }
  DeleteTrader(id: number) {
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
        this.traderservice.DeleteTrader(id).subscribe(
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
              title: 'Trader has not been deleted!.',
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
          title: 'Trader has not been deleted!.',
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
      const traderId = selectedValue.substr(5);
      this.openModal(traderId);
      this.allowEdit = true;
    } else {
      this.DeleteTrader(selectedValue);
    }
    event.target.value = 'action';
  }

  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();

    return this.traders.filter((item) => {
      const itemName = item.userName?.toLowerCase();

      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }

  // Add

  onsubmit() {
    this.traderservice.GetAllTraders().subscribe((data: any) => {
      this.traders = this.filteredData = data;
    });
    if (!this.allowEdit) {
      this.traderservice.AddTrader(this.traderForm.value).subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            confirmButtonColor: '#00b2ff',
            width: '416px',
          });
          this.formModel = document.getElementById('traderModel');
          this.formModel.classList.remove('show');
          this.formModel.style.display = 'none';
          document.body.classList.remove('modal-open');
          this.loadData();
        },
        (error) => {
          alert('error !!!!!!');
        }
      );
      this.traderForm.reset();
    } else {
      this.onEdit();
    }
  }

  openModal(id: any) {
    if (!id) {
      this.allowEdit = false;
    } else {
      this.getData(id);
      this.traderId = id;
    }
    this.formModel = document.getElementById('traderModel');
    this.formModel.classList.add('show');
    this.formModel.style.display = 'block';
    document.body.classList.add('modal-open');
  }
  getPaginatedData(index: any) {
    this.traderservice
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.traders = this.filteredData = data.data;
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
    }).then((result: any) => {
      if (result.value) {
        this.formModel = document.getElementById('traderModel');
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

  onEdit() {
    this.traderservice
      .updateTrader(this.traderId, this.traderForm.value)
      .subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            width: '416px',
            confirmButtonColor: '#00b2ff',
          });
          this.formModel = document.getElementById('traderModel');
          this.formModel.classList.remove('show');
          this.formModel.style.display = 'none';
          document.body.classList.remove('modal-open');
          this.loadData();
        },
        (error) => {
          alert('error !!! data is not updated');
          console.log(error);
        }
      );
  }

  getData(id: any) {
    this.traderservice.getTraderById(id).subscribe((data: Trader_1) => {
      console.log(data);
      this.traderForm.setValue({
        userName: data.userName,
        email: data.email,
        address: data.address,
        password: '',
        costPerRefusedOrder: data.costPerRefusedOrder,
        companyBranch: data.companyBranch,
        phoneNumber: data.phoneNumber,
      });
    });
  }
}
