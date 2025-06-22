export interface IEmployee {
  id?: string;
  departmentId?: string;
  departmentName?: string;
  surname: string;
  name: string;
  secondName?: string;
  startWorking: string | undefined;
  birthday: string | undefined;
  salary: number;
}
