import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './employee-service';
import {Employee} from './employee';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  public employees: Employee[] = [];
  public current: Employee = new Employee();

  public addMode = true;

  constructor(
    public employeeService: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.employeeService.stream();
    this.watch();
  }

  watch() {
    this.employeeService.employeesObservable.subscribe(e => {
      if (e != null) {
        this.employees.unshift(e);
      }
    });
  }

  open(employee: Employee) {
    this.addMode = false;
    this.current = employee;
    this.sidenav.toggle();
  }

  add() {
    this.addMode = true;
    this.current = new Employee();
    this.current.work = true;
    this.sidenav.open();
  }

  save() {
    this.sidenav.close();
  }

  remove(index: number, employee: Employee) {
    this.employees.splice(index, 1);
  }
}
