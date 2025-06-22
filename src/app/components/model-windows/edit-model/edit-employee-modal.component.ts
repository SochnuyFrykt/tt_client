import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IEmployee } from '../../../models/employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: 'edit-employee-modal.component.html'
})
export class EditEmployeeModalComponent {
  @Input() employee!: IEmployee;

  constructor(public activeModal: NgbActiveModal) {}

  get fullName(): string {
    return [this.employee.surname, this.employee.name, this.employee.secondName].join(' ');
  }

  set fullName(value: string) {
    const parts = value.trim().split(/\s+/).filter(part => part);

    // Assign parts to employee properties
    this.employee.surname = parts[0] || '';
    this.employee.name = parts[1] || '';
    this.employee.secondName = parts.slice(2).join(' ') || '';
  }

  save(): void {
    // Здесь будет логика сохранения изменений
    console.log('Сотрудник сохранен:', this.employee);
    this.activeModal.close('save');
  }
}
