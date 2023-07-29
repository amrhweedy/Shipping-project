import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PrivellageService } from 'src/app/Core/Services/privellage.service';
import { privilege } from 'src/app/Core/Models/Privellage';
import {
  Branch,
  City,
  Employee,
  Government,
  Order,
  Role,
  Sales,
  Trader,
} from 'src/app/Core/Models/Permission';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditPrevillageComponent implements OnInit {
  editPrivilegeForm!: FormGroup;
  id!: number;

  constructor(
    private privilegeservice: PrivellageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.editPrivilegeForm = new FormGroup({
      name: new FormControl(null, Validators.required),

      [Government.Read]: new FormControl(null, Validators.required),
      [Government.Create]: new FormControl(null, Validators.required),
      [Government.Update]: new FormControl(null, Validators.required),
      [Government.Delete]: new FormControl(null, Validators.required),

      [City.Read]: new FormControl(null, Validators.required),
      [City.Create]: new FormControl(null, Validators.required),
      [City.Update]: new FormControl(null, Validators.required),
      [City.Delete]: new FormControl(null, Validators.required),

      [Trader.Read]: new FormControl(null, Validators.required),
      [Trader.Create]: new FormControl(null, Validators.required),
      [Trader.Update]: new FormControl(null, Validators.required),
      [Trader.Delete]: new FormControl(null, Validators.required),

      [Employee.Read]: new FormControl(null, Validators.required),
      [Employee.Create]: new FormControl(null, Validators.required),
      [Employee.Update]: new FormControl(null, Validators.required),
      [Employee.Delete]: new FormControl(null, Validators.required),

      [Branch.Read]: new FormControl(null, Validators.required),
      [Branch.Create]: new FormControl(null, Validators.required),
      [Branch.Update]: new FormControl(null, Validators.required),
      [Branch.Delete]: new FormControl(null, Validators.required),

      [Sales.Read]: new FormControl(null, Validators.required),
      [Sales.Create]: new FormControl(null, Validators.required),
      [Sales.Update]: new FormControl(null, Validators.required),
      [Sales.Delete]: new FormControl(null, Validators.required),

      [Order.Read]: new FormControl(null, Validators.required),
      [Order.Create]: new FormControl(null, Validators.required),
      [Order.Update]: new FormControl(null, Validators.required),
      [Order.Delete]: new FormControl(null, Validators.required),

      [Role.Read]: new FormControl(null, Validators.required),
      [Role.Create]: new FormControl(null, Validators.required),
      [Role.Update]: new FormControl(null, Validators.required),
      [Role.Delete]: new FormControl(null, Validators.required),
    });

    const id = this.route.snapshot.params['id'];
    this.id = id;

    this.privilegeservice.getPrivilegeById(id).subscribe((data: any) => {
      console.log(data);
      let newdata = data as { name: string; claims: [{ type: string }] };
      this.editPrivilegeForm.patchValue({ name: newdata.name });

      newdata.claims.forEach((item) => {
        this.editPrivilegeForm.patchValue({
          [item.type]: true,
        });
      });
    });
  }

  onsubmit() {
    const claims: string[] = [];

    Object.entries(this.editPrivilegeForm.value).forEach(([key, value]) => {
      if (value == true || value == 'true') {
        claims.push(key);
      }
    });
    console.log(claims);

    const role = {
      name: this.editPrivilegeForm.get('name')?.value,
      claims: claims,
    };

    if (claims.length > 0) {
      console.log(role);
      this.privilegeservice.updatePrivilege(this.id, role).subscribe(
        (data: any) => {
          alert('success update');
          this.router.navigate(['/home/privilege']);
        },
        (error) => {
          alert('error !!!!!');
          console.log(error);
        }
      );
    } else {
      alert('permissions must be found');
    }
  }
}
