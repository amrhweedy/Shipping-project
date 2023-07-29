import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Role } from 'src/app/Core/Models/Permission';
import { privilege } from 'src/app/Core/Models/Privellage';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { PrivellageService } from 'src/app/Core/Services/privellage.service';
import Swal from 'sweetalert2';

declare var window: any;
@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayPrivellageComponent implements OnInit {
  privileges: privilege[] = [];
  filteredData: privilege[] = [];
  privilegeForm!: FormGroup;
  formModel: any;
  id!: number;

  editPermission = false;
  createPermission = false;
  deletePermission = false;

  constructor(
    private privellageser: PrivellageService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.editPermission = auth.checkPermission(Role.Update);
    this.createPermission = auth.checkPermission(Role.Create);
    this.deletePermission = auth.checkPermission(Role.Delete);
  }

  ngOnInit(): void {
    this.privellageser.getAllPrivellages().subscribe((data: any) => {
      this.privileges = this.filteredData = data;
      console.log(data);
    });
  }

  deletePrivilege(id: number) {
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
        this.privellageser.deletePrivilege(id).subscribe(
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
              title: 'Permission has not been deleted!.',
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
          title: 'Permission has not been deleted!.',
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

  loadData() {
    this.privellageser.getAllPrivellages().subscribe((data: any) => {
      this.privileges = this.filteredData = data;
    });
  }

  onOptionSelected(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue.startsWith('edit/')) {
      const privilegeId = selectedValue.substr(5);
      this.router.navigate([`/home/privilege/edit/${privilegeId}`]);
    } else {
      this.deletePrivilege(selectedValue);
    }
    event.target.value = 'action';
  }

  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();

    return this.privileges.filter((item) => {
      const itemName = item.name?.toLowerCase();

      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }

  getData(id: any) {
    this.privellageser.getPrivilegeById(id).subscribe((data: privilege) => {
      console.log(data);

      this.privilegeForm.setValue({
        name: data.name,
        date: data.date,
      });
    });
  }

  onAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
