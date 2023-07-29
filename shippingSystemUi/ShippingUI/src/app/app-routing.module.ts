import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Core/Services/auth.guard';
import { SidebarComponent } from './Shared/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { DisplayEmployeeComponent } from './components/Employee/display/display.component';
import { DisplayGovernmentComponent } from './components/Government/display/display.component';
import { DisplayBranchComponent } from './components/Branch/display-branch/display-branch.component';
import { DisplayOrdersStatesComponent } from './components/Order/display-orders-states/display-orders-states.component';
import { DisplayOrdersComponent } from './components/Order/display-orders/display-orders.component';
import { WeightCostPerOrderComponent } from './components/Order/weight-cost-per-order/weight-cost-per-order.component';
import { DisplayPrivellageComponent } from './components/Privellge/display/display.component';
import DisplaySalesComponent from './components/Sales Representator/display-sales/display-sales.component';
import { OrdersListComponent } from './components/SalesRepresentative/orders-list/orders-list.component';
import { OrdersStatesComponent } from './components/SalesRepresentative/orders-states/orders-states.component';
import { OrderDispalyTraderComponent } from './components/Trader-View/order-display-Trader/order-display-Trader.component';
import { OrdersStatesTraderComponent } from './components/Trader-View/orders-states-trader/orders-states-trader.component';
import { DisplayCityComponent } from './components/City/display-city/display-city.component';
import { DisplayTraderComponent } from './components/Trader/display/display.component';
import {
  Branch,
  City,
  Employee,
  Government,
  Order,
  Role,
  Sales,
  Trader,
} from './Core/Models/Permission';
import { AddOrderComponent } from './components/Trader-View/add-order/add-order.component';
import { EditOrderComponent } from './components/Trader-View/edit-order/edit-order.component';
import { OrderReportComponent } from './components/order-report/order-report.component';
import { AddPrivellageComponent } from './components/Privellge/add/add.component';
import { EditPrevillageComponent } from './components/Privellge/edit/edit.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'branch',
        component: DisplayBranchComponent,
        data: { permission: Branch.Read },
      },
      {
        path: 'city',
        component: DisplayCityComponent,
        data: { permission: City.Read },
      },
      {
        path: 'trader',
        component: DisplayTraderComponent,
        data: { permission: Trader.Read },
      },
      {
        path: 'employee',
        component: DisplayEmployeeComponent,
        data: { permission: Employee.Read },
      },
      {
        path: 'sales',
        component: DisplaySalesComponent,
        data: { permission: Sales.Read },
      },
      {
        path: 'order/states/employee',
        component: DisplayOrdersStatesComponent,
        data: { permission: Order.Read },
      },
      {
        path: 'order/list/employee',
        component: DisplayOrdersComponent,
        data: { permission: Order.Read },
      },
      {
        path: 'order/list/employee/order/add',
        component: AddOrderComponent,
        data: { permission: Order.Create },
      },
      {
        path: 'order/list/employee/order/edit/:id',
        component: EditOrderComponent,
        data: { permission: Order.Update },
      },
      { path: 'order/weightoption', component: WeightCostPerOrderComponent },
      {
        path: 'privilege',
        component: DisplayPrivellageComponent,
        data: { permission: Role.Read },
      },
      {
        path: 'privilege/add',
        component: AddPrivellageComponent,
        data: { permission: Role.Create },
      },
      {
        path: 'privilege/edit/:id',
        component: EditPrevillageComponent,
        data: { permission: Role.Update },
      },
      {
        path: 'government',
        component: DisplayGovernmentComponent,
        data: { permission: Government.Read },
      },

      {
        path: 'order/list/trader',
        component: OrderDispalyTraderComponent,
        data: { permission: Order.Read },
      },
      {
        path: 'order/states/trader',
        component: OrdersStatesTraderComponent,
        data: { permission: Order.Read },
      },

      {
        path: 'order/list/sales',
        component: OrdersListComponent,
        data: { permission: Order.Read },
      },
      {
        path: 'order/states/sales',
        component: OrdersStatesComponent,
        data: { permission: Order.Read },
      },

      {
        path: 'order/list/employee/order/add',
        component: AddOrderComponent,
        data: { permission: Order.Create },
      },
      {
        path: 'order/list/employee/order/edit/:id',
        component: EditOrderComponent,
        data: { permission: Order.Update },
      },
      {
        path: 'order/list/trader/order/add',
        component: AddOrderComponent,
        data: { permission: Order.Create },
      },
      {
        path: 'order/list/trader/order/edit/:id',
        component: EditOrderComponent,
        data: { permission: Order.Update },
      },
      {
        path: 'order/report',
        component: OrderReportComponent,
        data: { permission: Order.Read },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
