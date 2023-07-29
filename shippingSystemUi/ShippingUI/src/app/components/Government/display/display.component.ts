import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Goverment } from 'src/app/Core/Models/Goverment';
import { CityService } from 'src/app/Core/Services/city.service';
import { GovermentService } from 'src/app/Core/Services/goverment.service';

import Swal from 'sweetalert2';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { Government } from 'src/app/Core/Models/Permission';

declare var window: any;
@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayGovernmentComponent implements OnInit {
  governments: Goverment[] = [];
  filteredData: Goverment[] = [];
  allowEdit = false;
  formModel: any;
  governmentId!: number;
  governmentForm!: FormGroup;
  $pageSize = 5;
  $totalItems = 0;
  $page = 1;

  editPermission = false;
  deletePermission = false;
  createPermission = false;

  constructor(
    private governmentService: GovermentService,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Government.Update);
    this.createPermission = auth.checkPermission(Government.Create);
    this.createPermission = auth.checkPermission(Government.Delete);
  }
  ngOnInit(): void {
    this.governmentService
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.governments = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });
    this.governmentForm = new FormGroup({
      governmentName: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
    });
    this.formModel = new window.bootstrap.Modal(
      document.getElementById('exampleModalCenter')
    );
  }
  loadData() {
    this.governmentService.GetAllGovernment().subscribe((data: any) => {
      this.governments = this.filteredData = data;
    });
  }
  // Add and Edit

  getData(id: any) {
    this.governmentService
      .getGovernmentById(id)
      .subscribe((data: Goverment) => {
        console.log(data);
        this.governmentForm.setValue({
          governmentName: data.govermentName,
          state: data.state,
        });
      });
  }
  onEdit() {
    const government = {
      govermentName: this.governmentForm.value.governmentName,
      state: this.governmentForm.value.state === 'true', 
    };

    this.governmentService
      .EditGovernment(this.governmentId, government)
      .subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            confirmButtonColor: '#00b2ff',
          });
          this.formModel = document.getElementById('governmentModel');
          this.formModel.classList.remove('show');
          this.formModel.style.display = 'none';
          document.body.classList.remove('modal-open');
          this.loadData();
        },
        (error: any) => {
          alert('error !!!!!!!!');
        }
      );
  }

  onsubmit() {
    if (!this.allowEdit) {
      const government = {
        govermentName: this.governmentForm.value.governmentName,
        state: this.governmentForm.value.state === 'true', // Retrieve the selected value from the dropdown
      };
      console.log(government);
      this.governmentService.addGovernment(government).subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Form has been successfully submitted!',
            icon: 'success',
            confirmButtonColor: '#00b2ff',
          });
          this.formModel = document.getElementById('governmentModel');
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
    } else {
      this.onEdit();
    }
  }

  // Modal
  openModal(id: any) {
    if (!id) {
      this.allowEdit = false;
    } else {
      this.getData(id);
      this.allowEdit = true;
      this.governmentId = id;
    }
    this.formModel = document.getElementById('governmentModel');
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
        this.formModel = document.getElementById('governmentModel');
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
    this.governmentForm.reset();
  }

  // Search
  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();
    return this.governments.filter((item) => {
      const itemName = item.govermentName?.toLowerCase();
      return itemName?.startsWith(searchTerm);
    });
  }

  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }

  getPaginatedData(index: any) {
    this.governmentService
      .getPaginatedData(this.$page, this.$pageSize)
      .subscribe((data: any) => {
        this.governments = this.filteredData = data.data;
        this.$totalItems = data?.totalRecords || 0;
        this.$page = data?.pageNo;
      });
  }
}
