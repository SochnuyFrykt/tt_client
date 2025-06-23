import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbActiveModal, NgbDateStruct, NgbInputDatepicker, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {IEmployee} from '../../../models/employee.model';
import {CreateDepartmentModelComponent} from '../create-department/create-department-model.component';
import {IDepartment} from '../../../models/department.model';
import {DepartmentService} from '../../../services/department.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NgbInputDatepicker],
  templateUrl: "create-employee-modal.component.html"
})
export class CreateEmployeeModalComponent implements OnInit {
  @Input() Initials!: string;
  @Input() DataBirthday!: NgbDateStruct | null;
  @Input() HireDate!: NgbDateStruct | null;
  @Input() Salary!: number;
  @Input() Department!: string;

  departments: IDepartment[] = [];

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private departmentService: DepartmentService,
              private api: ApiService) {}

  async ngOnInit() {
    await this.loadDepartments();
  }

  openCreateDepartmentModel(): void {
    const modalRef = this.modalService.open(CreateDepartmentModelComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then((result) => {
      if (result === 'create') {
        this.departmentService.clearCache();
        this.loadDepartments();
      }
    });
  }

  async loadDepartments() {
    this.departments = await this.departmentService.getDepartments();
  }

  async confirmCreate(): Promise<void> {
    let initials = this.Initials.trim().split(' ');
    const toDate = (date: NgbDateStruct | null): string | undefined => {
      if (!date) return undefined;
      return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}T00:00:00`;
    };

    console.log(toDate(this.DataBirthday))
    const responce = await this.api.create<IEmployee>({
      NameController: 'Employee'
    }, {
      departmentId: this.Department, surname: initials[0], name: initials[1],
      secondName: initials[2] ?? null, startWorking: toDate(this.HireDate),
      birthday: toDate(this.DataBirthday), salary: this.Salary
    });

    if (responce) {
      this.activeModal.close('created');
      return;
    }
    alert("Что-то пошло не так при создании нового пользователя");
    return;
  }
}
