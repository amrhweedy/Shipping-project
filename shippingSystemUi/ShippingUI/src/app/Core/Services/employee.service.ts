import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  GetAllEmployees() {
    return this.http.get('http://localhost:5250/api/Employees');
  }

  getEmployeeById(employeeId: number) {
    return this.http.get(`http://localhost:5250/api/Employees/${employeeId}`);
  }

  AddEmployee(employee: {}) {
    return this.http.post('http://localhost:5250/api/Employees', employee, {
      responseType: 'text',
    });
  }

  updateEmployee(employeeid: number, employee: any) {
    return this.http.put(
      `http://localhost:5250/api/Employees/${employeeid}`,
      employee,
      {
        responseType: 'text',
      }
    );
  }
  getPaginatedData(pageNum: number, pageSize: number): Observable<any[]> {
    const apiUrl = `http://localhost:5250/api/Employees/paginated?PageNumber=${pageNum}&PageSize=${pageSize}`;
    console.log('branch service', this.http.get<any[]>(apiUrl));

    return this.http.get<any[]>(apiUrl);
  }

  changeIsActive(employeeId: number) {
    return this.http.delete(
      `http://localhost:5250/api/Employees/${employeeId}`,
      {
        responseType: 'text',
      }
    );
  }
  
}
