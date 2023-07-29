import { Component } from '@angular/core';
import { privilege } from 'src/app/Core/Models/Privellage';

@Component({
  selector: 'app-display-permission',
  templateUrl: './display-permission.component.html',
  styleUrls: ['./display-permission.component.css'],
})
export class DisplayPermissionComponent {
  permissions: privilege[] = [];
  filteredData: privilege[] = [];

  filterData(inputValue: string) {
    const searchTerm = inputValue.toLowerCase().trim();

    return this.permissions.filter((item) => {
      const itemName = item.name?.toLowerCase();

      return itemName?.startsWith(searchTerm);
    });
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    this.filteredData = this.filterData(inputValue);
  }
}
