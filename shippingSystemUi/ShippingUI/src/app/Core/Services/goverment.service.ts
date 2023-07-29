import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Goverment } from '../Models/Goverment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GovermentService {
  constructor(private http: HttpClient) {}

  GetAllGovernment() {
    return this.http.get('http://localhost:5250/api/Goverments');
  }
  addGovernment(newGovernment: any) {
    return this.http.post(
      'http://localhost:5250/api/Goverments',
      newGovernment,
      {
        responseType: 'text',
      }
    );
  }

  EditGovernment(GovermentId: number, Goverment: Goverment) {
    console.log(Goverment, GovermentId);

    return this.http.put(
      `http://localhost:5250/api/Goverments/${GovermentId}`,
      Goverment
    );
  }

  getGovernmentById(GovernmentId: number) {
    return this.http.get(
      `http://localhost:5250/api/Goverments/${GovernmentId} `
    );
  }
  deleteGovernment(GovernmentId: number) {
    return this.http.delete(
      `http://localhost:5250/api/Goverments/${GovernmentId} `
    );
  }
  getPaginatedData(pageNum: number, pageSize: number): Observable<any[]> {
    const apiUrl = `http://localhost:5250/api/Goverments/paginated?PageNumber=${pageNum}&PageSize=${pageSize}`;
    console.log('branch service', this.http.get<any[]>(apiUrl));

    return this.http.get<any[]>(apiUrl);
  }
}
