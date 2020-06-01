import {EmployeeActivity} from './employee-activity';

export class Employee {
  constructor(
    public id?: string,
    public name?: string,
    public photo?: string,
    public position?: string,
    public activity?: EmployeeActivity,
    public salary?: number,
    public work?: boolean,
    public hired?: Date
  ) {

  }
}
