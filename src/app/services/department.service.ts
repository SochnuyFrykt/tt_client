import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import { IDepartment } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private departmentsCache: IDepartment[] | null = null;

  constructor(private api: ApiService) {}

  async getDepartments(): Promise<IDepartment[]> {
    if (this.departmentsCache) {
      return this.departmentsCache;
    }

    this.departmentsCache = await this.api.getAll<IDepartment>({
      NameController: 'Department'
    });

    return this.departmentsCache;
  }

  clearCache() {
    this.departmentsCache = null;
  }
}
