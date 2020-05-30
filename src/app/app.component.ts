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
  public current: Employee;

  constructor(
    public employeeService: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.employeeService.stream();

    this.employeeService.employeesObservable.subscribe(e => {
      if (e != null) {
        this.employees.push(e);
        console.log(e);
      }
    });
  }

  open(employee: Employee) {
    this.current = employee;
    this.sidenav.toggle();
  }
}
