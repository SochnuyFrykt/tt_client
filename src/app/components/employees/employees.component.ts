import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IEmployee} from '../../models/employee.model';
import {NgbDatepickerModule, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditEmployeeModalComponent} from '../model-windows/edit-model/edit-employee-modal.component';
import {DeleteEmployeeModalComponent} from '../model-windows/delete-model/delete-employee-modal.component';
import {CreateEmployeeModalComponent} from '../model-windows/create-model/create-employee-modal.component';
import {EmployeeService} from '../../services/employee.service';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {IRequest} from '../../models/request.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule
  ],
  templateUrl: 'employees.component.html'
})
export class EmployeesComponent implements OnInit {
  employees: IEmployee[] = [];
  sortedColumn: keyof IEmployee = 'surname';
  sortDirection: 'asc' | 'desc' = 'asc';

  loading: boolean = false;
  departmentNameFilter = '';
  fullNameFilter = '';
  birthDayDateFilter: NgbDateStruct | null = null;
  hireDateFilter: NgbDateStruct | null = null;
  salaryFilter = '';

  filterChanged = new Subject<void>();

  constructor(private modalService: NgbModal,
              private employeeService: EmployeeService,) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.filterChanged.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadEmployees();
    });
  }

  applyFilters(): void {
    this.filterChanged.next(this.loadEmployees());
  }

  loadEmployees(): void {
    this.loading = true;

    const params : IRequest = {
      departmentName: this.departmentNameFilter,
      initials: this.fullNameFilter,
      birthday: this.formatDate(this.birthDayDateFilter),
      startWorking: this.formatDate(this.hireDateFilter),
      salary: this.salaryFilter
    };

    this.employeeService.getEmployees({...params})
      .then(data => {
      this.employees = data;
      this.loading = false;
    }).catch(err => {
      console.error('Ошибка при загрузке сотрудников:', err)
      this.loading = false;
    })
  }

  sortData(column: keyof IEmployee): void {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadEmployees();
  }

  getSortIcon(column: keyof IEmployee): string {
    if (this.sortedColumn !== column) return '';
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  resetFilters(): void {
    this.departmentNameFilter = '';
    this.fullNameFilter = '';
    this.birthDayDateFilter = null;
    this.hireDateFilter = null;
    this.salaryFilter = '';
    this.loadEmployees();
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateEmployeeModalComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then(
      (result) => {
        if (result === 'created') {
          this.loadEmployees();
        }
      },
      () => {}
    );
  }

  openEditModal(employee: IEmployee): void {
    const modalRef = this.modalService.open(EditEmployeeModalComponent, {
      centered: true,
      size: 'lg'
    });

    modalRef.componentInstance.employee = {...employee};

    modalRef.result.then((result) => {
        if (result === 'edit') {
          this.loadEmployees();
        }
      }, () => {}
    );
  }

  openDeleteModal(employee: IEmployee): void {
    const modalRef = this.modalService.open(DeleteEmployeeModalComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.employee = { ...employee };

    modalRef.result.then(
      (result) => {
        if (result === 'deleted') {
          this.loadEmployees();
        }
      }, () => {}
    );
  }

  private formatDate(dateStruct: NgbDateStruct | null | undefined): string | null {
    if (dateStruct) {
      const month = dateStruct.month.toString().padStart(2, '0');
      const day = dateStruct.day.toString().padStart(2, '0');
      return `${dateStruct.year}-${month}-${day}T00:00:00`;
    }
    return null; // Важно вернуть undefined, а не пустую строку
  }
}
