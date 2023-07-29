import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrivellageService } from 'src/app/Core/Services/privellage.service';
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
import { last } from 'rxjs';
import { formatDate } from 'src/app/Core/Models/Date';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddPrivellageComponent implements OnInit {
  addPrivilegeForm!: FormGroup;

  constructor(
    private privilegeservice: PrivellageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addPrivilegeForm = new FormGroup({
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
  }

  onsubmit() {
    const claims: string[] = [];

    Object.entries(this.addPrivilegeForm.value).forEach(([key, value]) => {
      if (value == true || value == 'true') {
        claims.push(key);
      }
    });
    console.log(claims);

    const role = {
      name: this.addPrivilegeForm.get('name')?.value,
      date: formatDate(),
      claims: claims,
    };

    if (claims.length > 0) {
      console.log(role);
      this.privilegeservice.addPrivilege(role).subscribe(
        (data) => {
          alert('success add');
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
