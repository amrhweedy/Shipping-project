import { Data } from '@angular/router';

export interface Employee {
  employeeId?: number;
  name?: string;
  email?: string;
  userName?: string;
  password?: string;
  phoneNumber?: string;
  isActive?: boolean;
  branch?: {
    id: number;
    branchName: string;
    createdAt: Data;
    state: boolean;
  };
  // privellage?: {
  //   privellge_Id: number;
  //   privellgeName: string;
  //   date: Data;
  // };
}
