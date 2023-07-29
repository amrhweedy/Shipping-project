// import { Injectable } from '@angular/core';
// import {
//   Resolve,
//   Routes,
// } from '@angular/router';
// import { Observable, delay, of } from 'rxjs';
// import { DisplayBranchComponent } from 'src/app/components/Branch/display-branch/display-branch.component';
// import { DisplayEmployeeComponent } from 'src/app/components/Employee/display/display.component';
// import { DisplayGovernmentComponent } from 'src/app/components/Government/display/display.component';
// import { DisplayOrdersStatesComponent } from 'src/app/components/Order/display-orders-states/display-orders-states.component';
// import { DisplayOrdersComponent } from 'src/app/components/Order/display-orders/display-orders.component';
// import { WeightCostPerOrderComponent } from 'src/app/components/Order/weight-cost-per-order/weight-cost-per-order.component';
// import { AddPrivellageComponent } from 'src/app/components/Privellge/add/add.component';
// import { DisplayPrivellageComponent } from 'src/app/components/Privellge/display/display.component';
// import { EditPrevillageComponent } from 'src/app/components/Privellge/edit/edit.component';
// import DisplaySalesComponent from 'src/app/components/Sales Representator/display-sales/display-sales.component';
// import { OrdersListComponent } from 'src/app/components/SalesRepresentative/orders-list/orders-list.component';
// import { OrdersStatesComponent } from 'src/app/components/SalesRepresentative/orders-states/orders-states.component';
// import { OrderDispalyTraderComponent } from 'src/app/components/Trader-View/order-display-Trader/order-display-Trader.component';
// import { OrdersStatesTraderComponent } from 'src/app/components/Trader-View/orders-states-trader/orders-states-trader.component';
// import { DisplayTraderComponent } from 'src/app/components/Trader/display/display.component';
// import { Roles } from '../Models/Roles';
// import { DisplayCityComponent } from 'src/app/components/City/display-city/display-city.component';
// import { AddOrderComponent } from 'src/app/components/Trader-View/add-order/add-order.component';
// import { EditOrderComponent } from 'src/app/components/Trader-View/edit-order/edit-order.component';

// @Injectable({
//   providedIn: 'root',
// })
// export class RoleResolver implements Resolve<any> {
//   resolve(): Observable<any> {
//     return of(null).pipe(delay(10000));
//   }
// }

// export const generateRoutesForRole = (): Promise<Routes> => {
//   return new Promise((resolve, reject) => {
//     const storedRole = localStorage.getItem('role');
//     console.log(storedRole);

//     let routes: Routes = [];

//     if (storedRole === Roles.Employee) {
//       routes = [
//         { path: 'branch', component: DisplayBranchComponent },
//         { path: 'city', component: DisplayCityComponent },
//         { path: 'trader', component: DisplayTraderComponent },
//         { path: 'employee', component: DisplayEmployeeComponent },
//         { path: 'sales', component: DisplaySalesComponent },
//         {
//           path: 'order/states/employee',
//           component: DisplayOrdersStatesComponent,
//         },
//         { path: 'order/list/employee', component: DisplayOrdersComponent },
//         { path: 'order/weightoption', component: WeightCostPerOrderComponent },
//         { path: 'privilege', component: DisplayPrivellageComponent },
//         { path: 'privilege/add', component: AddPrivellageComponent },
//         { path: 'privilege/edit/:id', component: EditPrevillageComponent },
//         { path: 'government', component: DisplayGovernmentComponent },
//         { path: 'branch', component: DisplayBranchComponent },
//       ];
//     } else if (storedRole === Roles.Trader) {
//       routes = [
//         { path: 'order/list/trader', component: OrderDispalyTraderComponent },
//         { path: 'order/states/trader', component: OrdersStatesTraderComponent },
//       ];
//     } else if (storedRole === Roles.SalesRepresentative) {
//       routes = [
//         { path: 'order/list/sales', component: OrdersListComponent },
//         { path: 'order/states/sales', component: OrdersStatesComponent },
//       ];
//     } else if (storedRole == Roles.Admin) {
//       routes = [
//         { path: 'branch', component: DisplayBranchComponent },
//         { path: 'city', component: DisplayCityComponent },
//         { path: 'trader', component: DisplayTraderComponent },
//         { path: 'employee', component: DisplayEmployeeComponent },
//         { path: 'sales', component: DisplaySalesComponent },
//         {
//           path: 'order/states/employee',
//           component: DisplayOrdersStatesComponent,
//         },
//         { path: 'order/list/employee', component: DisplayOrdersComponent },
//         { path: 'order/weightoption', component: WeightCostPerOrderComponent },
//         { path: 'privilege', component: DisplayPrivellageComponent },
//         { path: 'privilege/add', component: AddPrivellageComponent },
//         { path: 'privilege/edit/:id', component: EditPrevillageComponent },
//         { path: 'government', component: DisplayGovernmentComponent },

//         { path: 'order/list/trader', component: OrderDispalyTraderComponent },
//         { path: 'order/states/trader', component: OrdersStatesTraderComponent },

//         { path: 'order/list/sales', component: OrdersListComponent },
//         { path: 'order/states/sales', component: OrdersStatesComponent },
//         { path: 'order/add', component: AddOrderComponent },
//         { path: 'order/edit/:id', component: EditOrderComponent },
//       ];
//     }

//     resolve(routes);
//   });
// };
