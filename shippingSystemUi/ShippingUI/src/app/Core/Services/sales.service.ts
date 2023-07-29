import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  constructor(private http: HttpClient) {}

  getSalesByID(id: number) {
    return this.http.get('http://localhost:5250/api/Sales/id', {
      params: new HttpParams().set('id', id),
    });
  }

  getAllSales() {
    return this.http.get('http://localhost:5250/api/Sales');
  }

  addSalesRepresentator(data: any) {
    return this.http.post('http://localhost:5250/api/Sales', data, {
      responseType: 'text',
    });
  }

  deleteSales(id: number) {
    return this.http.delete(`http://localhost:5250/api/Sales`, {
      params: new HttpParams().set('id', id),

      responseType: 'text',
    });
  }

  updateSalesRepresentator(id: number, sales: any) {
    return this.http.put(`http://localhost:5250/api/Sales/${id}`, sales, {
      responseType: 'text',
    });
  }
  getSalesRepresentativeByEmail(email: string) {
    return this.http.get(`http://localhost:5250/api/Sales/${email}`);
  }

  getPaginatedData(pageNum: number, pageSize: number): Observable<any[]> {
    const apiUrl = `http://localhost:5250/api/Sales/paginated?PageNumber=${pageNum}&PageSize=${pageSize}`;
    console.log('branch service', this.http.get<any[]>(apiUrl));

    return this.http.get<any[]>(apiUrl);
  }
  assignOrderToSales(salesId: number, orderId: number) {
    const body = { salesId, orderId };

    return this.http.post(
      `http://localhost:5250/api/Employees/assign?salesId=${salesId}&orderId=${orderId}`,
      body
    );
  }
}
