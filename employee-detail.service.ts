import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailService {

  constructor(private http: HttpClient) { }

  findById(empId: number) {
    return this.http.get(ConfigurationService.getApiUrl() + '/api/employee/' + empId);
  }

  create(data: any) {
    return this.http.post(ConfigurationService.getApiUrl() + '/api/employee/create', data);
  }

  udpate(data: any) {
    return this.http.post(ConfigurationService.getApiUrl() + '/api/employee/update', data);
    
  }

}
