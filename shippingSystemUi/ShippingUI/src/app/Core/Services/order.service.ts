import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  URL: string = 'http://localhost:5250/api/Orders';
  constructor(private http: HttpClient) {}
  weightCost = {
    allowedWeight: 0,
    costPerKG: 0,
  };
  getAllOrders(email: string): any {
    const headers = new HttpHeaders().set('userEmail', email);
    const options = { headers: headers };

    return this.http.get(this.URL, options);
  }

  getOrderById(orderId: any): any {
    return this.http.get(`${this.URL}/${orderId}`);
  }
  updateOrder(orderId: number, order: any): any {
    return this.http.put(`${this.URL}/${orderId}`, order);
  }

  deleteOrderForTrader(orderId: number) {
    return this.http.delete(`${this.URL}/${orderId}`);
  }

  addOrder(order: any, email: string) {
    const headers = new HttpHeaders().set('userEmail', email);
    const options = { headers: headers };

    return this.http.post(`${this.URL}`, order, options);
  }
  AddWeightOptions(weight: number, cost: number) {
    localStorage.removeItem('weight');
    localStorage.removeItem('cost');

    localStorage.setItem('weight', JSON.stringify(weight));
    localStorage.setItem('cost', JSON.stringify(cost));
  }

  getWeightOptions() {
    let weight = parseInt(localStorage.getItem('weight')!);
    let cost = parseInt(localStorage.getItem('cost')!);
    return (this.weightCost = {
      allowedWeight: weight,
      costPerKG: cost,
    });
  }
  getPaginatedData(pageNum: number, pageSize: number): Observable<any[]> {
    const apiUrl = `http://localhost:5250/api/Orders/paginated?PageNumber=${pageNum}&PageSize=${pageSize}`;
    console.log('branch service', this.http.get<any[]>(apiUrl));

    return this.http.get<any[]>(apiUrl);
  }
}
