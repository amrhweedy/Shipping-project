import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrivellageService {
  constructor(private http: HttpClient) {}

  getAllPrivellages() {
    return this.http.get('http://localhost:5250/api/Permissions');
  }

  getPrivilegeById(privilege_id: number) {
    return this.http.get(
      `http://localhost:5250/api/Permissions/${privilege_id}`
    );
  }

  addPrivilege(newPrivilege: any) {
    return this.http.post(
      'http://localhost:5250/api/Permissions',
      newPrivilege
    );
  }

  deletePrivilege(privilege_id: number) {
    return this.http.delete(
      `http://localhost:5250/api/Permissions/${privilege_id}`,
      {
        responseType: 'text',
      }
    );
  }

  updatePrivilege(id: number, privilege: any) {
    return this.http.put(
      `http://localhost:5250/api/Permissions/${id}`,
      privilege,
      {
        responseType: 'text',
      }
    );
  }
}
