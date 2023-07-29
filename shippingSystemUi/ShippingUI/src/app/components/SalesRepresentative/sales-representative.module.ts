import { NgModule } from '@angular/core';
import { OrdersStatesComponent } from './orders-states/orders-states.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/Shared/SharedModule/shared.module';
import { OrderStateFormComponent } from './order-state-form/order-state-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OrdersStatesComponent,
    OrdersListComponent,
    OrderStateFormComponent,
  ],
  imports: [CommonModule, BrowserModule, SharedModule, RouterModule],
  exports: [
    OrdersStatesComponent,
    OrdersListComponent,
    OrderStateFormComponent,
  ],
})
export class SalesRepresentativeModule {}
