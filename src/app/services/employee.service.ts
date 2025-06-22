import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {IEmployee} from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private api: ApiService) {}

  getEmployees(): Promise<IEmployee[]> {
    return this.api.getAll<IEmployee>({
      NameController: 'employee',
      CustomEndpoint: 'employees_in_department'
    });
  }

  deleteEmployees(id: string): Promise<boolean> {
    return this.api.delete('employee' ,id)
  }
}
