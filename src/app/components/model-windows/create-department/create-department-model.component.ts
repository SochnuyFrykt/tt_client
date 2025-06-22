import { Component, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {IDepartment} from '../../../models/department.model';
import {DepartmentService} from '../../../services/department.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "create-department-model.component.html"
})
export class CreateDepartmentModelComponent {
  @Input() DepartmentName!: string;

  constructor(public activeModal: NgbActiveModal,
              private api: ApiService) {}

  async confirmCreate(): Promise<void> {

    const responce = await this.api.create<IDepartment>({
        NameController: 'Department'}, {
        name: this.DepartmentName});

    if (responce) {
      console.log(`Добавлен новый отдел: ${this.DepartmentName}`);
      this.activeModal.close('create');
      return;
    }
    alert("Извините, что-то пошло не так при создании нового отдела");
    this.activeModal.close('create');
    return;
  }
}
