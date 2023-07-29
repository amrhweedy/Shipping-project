import { AuthGuard } from 'src/app/Core/Services/auth.guard';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Branch as Branch_1 } from 'src/app/Core/Models/Branch';
import { BranchService } from 'src/app/Core/Services/branch.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { Branch } from 'src/app/Core/Models/Permission';
declare var window: any;

@Component({
  selector: 'app-display-branch',
  templateUrl: './display-branch.component.html',
  styleUrls: ['./display-branch.component.css'],
})
export class DisplayBranchComponent implements OnInit {
  branches: Branch_1[] = [];
  filteredData: Branch_1[] = [];
  BranchForm!: FormGroup;
  formModel: any;
  allowEdit = false;
  branchId!: number;
  $pageSize = 5;
  $totalItems = 0;
  $page = 1;

  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private branchService: BranchService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Branch.Update);
    this.deletePermission = auth.checkPermission(Branch.Delete);
    this.createPermission = auth.checkPermission(Branch.Create);
  }

  ngOnInit(): void {
    this.branchService
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.branches = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });

    this.BranchForm = new FormGroup({
      branchName: new FormControl(null, Validators.required),
      createdAt: new FormControl(null, Validators.required),
    });

    this.formModel = new window.bootstrap.Modal(
      document.getElementById('branchModel')
    );
  }
  loadData() {
    this.branchService.getAllBranches().subscribe((data: any) => {
      this.branches = this.filteredData = data;
    });
  }
  deleteBranch(id: number) {
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
        this.branchService.deleteBranch(id).subscribe(
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
              title: 'Branch has not been deleted!.',
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
          title: 'Branch has not been deleted!.',
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
      const branchid = selectedValue.substr(5);
      this.openModal(branchid);
      this.allowEdit = true;
    } else {
      const branchid = selectedValue;
      this.deleteBranch(branchid);
    }
    event.target.value = 'action';
  }

  changeState(id: number) {
    this.branchService.deleteBranch(id).subscribe(
      (data: any) => {
        alert('success deleted');
      },
      (error) => {
        alert(' error !!!!!!');
        console.log(error.message);
      }
    );
  }

  // Add  Modal

  onsubmit() {
    if (!this.allowEdit) {
      this.branchService
        .addBranch({
          ...this.BranchForm.value,
          state: true,
        })
        .subscribe(
          (data: any) => {
            Swal.fire({
              title: 'Form has been successfully submitted!',
              icon: 'success',
              confirmButtonColor: '#00b2ff',
              width: '416px',
            });
            this.formModel = document.getElementById('branchModel');
            this.formModel.classList.remove('show');
            this.formModel.style.display = 'none';
            document.body.classList.remove('modal-open');
            this.loadData();
          },
          (error) => {
            alert('error !!!!!');
            console.log(error);
          }
        );
      this.BranchForm.reset();
    } else this.onEdit();
    this.branchService.getAllBranches().subscribe((data: any) => {
      this.branches = this.filteredData = data;
    });
  }

  openModal(id: any) {
    if (!id) {
      this.allowEdit = false;
    } else {
      this.getData(id);
      this.branchId = id;
    }

    this.formModel = document.getElementById('branchModel');
    this.formModel.classList.add('show');
    this.formModel.style.display = 'block';
    document.body.classList.add('modal-open');
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
        this.formModel = document.getElementById('branchModel');
        this.formModel.classList.remove('show');
        this.formModel.style.display = 'none';
        document.body.classList.remove('modal-open');
      } else {
        Swal.fire({
          title: 'Your form has not been canceled!.',
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
    this.branchService
      .updateBranch(this.branchId, {
        ...this.BranchForm.value,
        id: this.branchId,
      })
      .subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            confirmButtonColor: '#00b2ff',
            width: '416px',
          });
          this.formModel = document.getElementById('branchModel');
          this.formModel.classList.remove('show');
          this.formModel.style.display = 'none';
          document.body.classList.remove('modal-open');
          this.loadData();
        },
        (error: any) => {
          alert('error !!!!!!!!');
        }
      );
    this.BranchForm.reset();
  }

  getData(id: any) {
    this.branchService.getBranchById(id).subscribe((data: Branch_1) => {
      this.BranchForm.setValue({
        branchName: data.branchName,
        createdAt: data.createdAt,
      });
    });
  }

  // Search
  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();
    return this.branches.filter((item) => {
      const itemName = item.branchName?.toLowerCase();
      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }

  getPaginatedData(index: any) {
    this.branchService
      .getPaginatedData(index, this.$pageSize)
      .subscribe((response: any) => {
        this.branches = this.filteredData = response?.data || [];
        this.$totalItems = response?.totalRecords || 0;
        this.$page = response?.pageNo;
      });
  }
}
