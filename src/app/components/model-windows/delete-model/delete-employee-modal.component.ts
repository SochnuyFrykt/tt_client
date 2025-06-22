import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IEmployee } from '../../../models/employee.model';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'delete-employee-modal.component.html'
})
export class DeleteEmployeeModalComponent {
  @Input() employee!: IEmployee;

  constructor(public activeModal: NgbActiveModal,
              private employeeService: EmployeeService) {}

  get fullName() {
    return [this.employee.surname!, this.employee.name!, this.employee.secondName || null].join(' ');
  }

  async confirmDelete(): Promise<void> {
    const response = await this.employeeService.deleteEmployees(this.employee.id!)

    if (response) {
      console.log('Сотрудник удален:', this.employee);
      this.activeModal.close('deleted');
      return;
    }
    alert("Что-то пошло не так при удалении пользователя");
    return;
  }
}
