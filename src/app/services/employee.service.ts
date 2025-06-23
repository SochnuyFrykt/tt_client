import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {IEmployee} from '../models/employee.model';
import {IRequest} from '../models/request.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private api: ApiService) {}

  getEmployees(params: IRequest): Promise<IEmployee[]> {

    const paramsUrl: Record<string, string> = {}

    if (params.departmentName) paramsUrl['departmentName'] = params.departmentName;
    if (params.initials) paramsUrl['initials'] = params.initials;
    if (params.birthday) paramsUrl['birthday'] = params.birthday;
    if (params.startWorking) paramsUrl['startWorking'] = params.startWorking;
    if (params.salary) paramsUrl['salary'] = params.salary;

    console.log(paramsUrl)
    return this.api.getAll<IEmployee>({
      NameController: 'employee',
      CustomEndpoint: 'employees_in_department'
    }, paramsUrl);
  }

  updateEmployee(id: string | undefined, params: IEmployee): Promise<boolean> {
    return this.api.update({id, NameController: 'employee'}, {...params});
  }

  deleteEmployees(id: string): Promise<boolean> {
    return this.api.delete('employee' ,id)
  }
}
