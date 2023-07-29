// import { generateRoutesForRole } from './../../Core/Services/role.resolver';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Roles } from 'src/app/Core/Models/Roles';
import { AuthGuard } from 'src/app/Core/Services/auth.guard';
import { AuthService } from 'src/app/Core/Services/auth.service';
import { BranchService } from 'src/app/Core/Services/branch.service';
import { TraderService } from 'src/app/Core/Services/trader.service';
import { SidebarComponent } from 'src/app/Shared/sidebar/sidebar.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  error!: string;
  routes: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private branchservice: BranchService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe((response: any) => {
      const token = response.token;
      this.authService.setToken(token);

      const claims = response.claims;
      this.authService.setClaims(claims);

      const role = response.role;
      this.authService.setUserRole(role);
      this.authService.setEmail(email);

      switch (role) {
        case Roles.Employee:
          this.router.navigate(['/home/branch']);

          this.branchservice.getAllBranches().subscribe((data: any) => {
            console.log(data);
          });

          break;
        case Roles.Admin:
          this.router.navigate(['/home/branch']);
          break;

        case Roles.Trader:
          this.router.navigate(['/home/order/list/trader']);
          break;
        case Roles.SalesRepresentative:
          this.router.navigate(['/home/order/list/sales']);
          break;
      }

      // const handleGeneratedRoutes = async () => {
      //   try {
      //     // const generatedRoutes: Routes = await generateRoutesForRole();
      //     const homeRoute = {
      //       path: 'home',
      //       component: SidebarComponent,
      //       canActivate: [AuthGuard],
      //       // children: generatedRoutes,
      //     };
      //     this.router.config.unshift(homeRoute);

      //
      //   } catch (error) {
      //     console.error(error);
      //   }
      // };

      // Promise.resolve().then(handleGeneratedRoutes);
      // },
      // (error) => {
      //   this.error = 'Invalid Email or Password';
    });
  }
}
