import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {IEmployee} from '../../../models/employee.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EmployeeService} from '../../../services/employee.service';
import {IDepartment} from '../../../models/department.model';
import {DepartmentService} from '../../../services/department.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbInputDatepicker
  ],
  templateUrl: 'edit-employee-modal.component.html'
})
export class EditEmployeeModalComponent implements OnInit {
  @Input() employee!: IEmployee;

  fullName: string = '';
  birthdayModel: NgbDateStruct | null = null;
  startWorkingDateModel: NgbDateStruct | null = null;

  departments: IDepartment[] = [];

  constructor(public activeModal: NgbActiveModal,
              private employeeService: EmployeeService,
              private departmentService: DepartmentService,) {}

  async ngOnInit() {
    await this.loadDepartments();
    this.fullName = [this.employee.surname, this.employee.name, this.employee.secondName].filter(Boolean).join(' ');
    this.birthdayModel = this.parseDate(this.employee.birthday);
    this.startWorkingDateModel = this.parseDate(this.employee.startWorking);
  }

  save(): void {
    const parts = this.fullName.trim().split(/\s+/).filter(part => part);
    this.employee.surname = parts[0] || '';
    this.employee.name = parts[1] || '';
    this.employee.secondName = parts[2] || '';

    this.employee.birthday = this.formatDate(this.birthdayModel);
    this.employee.startWorking = this.formatDate(this.startWorkingDateModel);

    const responce = this.employeeService.updateEmployee(this.employee.id, this.employee)
    if (!responce) {
      alert('Произошла ошибка из-за которой неудалось создать сотрудника :(')
      return;
    }

    console.log('Сотрудник сохранен:', this.employee);
    this.activeModal.close('edit');
  }

  private parseDate(dateString: string | undefined): NgbDateStruct | null {
    if (dateString) {
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate()
          };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private formatDate(dateStruct: NgbDateStruct | null): string | undefined {
    if (dateStruct) {
      const month = dateStruct.month.toString().padStart(2, '0');
      const day = dateStruct.day.toString().padStart(2, '0');
      return `${dateStruct.year}-${month}-${day}T00:00:00`;
    }
    return undefined;
  }

  async loadDepartments() {
    this.departments = await this.departmentService.getDepartments();
  }
}
