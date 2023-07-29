import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService } from 'src/app/Core/Services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  readGovernment = false;
  readCity = false;
  readEmployee = false;
  readSales = false;
  readTrader = false;
  readBranch = false;
  readOrder = false;
  readPrivilege = false;

  sidenavWidth = 5;
  role: any;
  Enable: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {
    this.readGovernment = authService.checkPermission(Government.Read);
    this.readCity = authService.checkPermission(City.Read);
    this.readEmployee = authService.checkPermission(Employee.Read);
    this.readSales = authService.checkPermission(Sales.Read);
    this.readTrader = authService.checkPermission(Trader.Read);
    this.readBranch = authService.checkPermission(Branch.Read);
    this.readOrder = authService.checkPermission(Order.Create);
    this.readPrivilege = authService.checkPermission(Role.Read);

    this.role = this.authService.getUserRole();

    if (this.role == 'employee' || this.role == 'admin') {
      this.Enable = true;
    }
  }
}
