import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './employee-service';
import {Employee} from './employee';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  public employees: Map<string, Employee>;
  public current: Employee = new Employee();

  addMode = true;
  loader = false;

  constructor(
    public employeeService: EmployeeService,
    public snackBar: MatSnackBar
  ) {
    this.employees = new Map<string, Employee>();
    this.current = new Employee();
  }

  ngOnInit(): void {
    this.employeeService.stream();
    this.watch();
  }

  watch() {
    this.employeeService.employeesObservable.subscribe(e => {
      if (e != null) {
        this.employees.set(e.id, e);
      }
    });
  }

  open(employee: Employee) {
    this.addMode = false;
    this.loader = true;

    this.employeeService.read(employee.id).subscribe(data => {
      this.current = data;
      this.loader = false;
    });

    this.sidenav.toggle();
  }

  add() {
    this.addMode = true;
    this.loader = false;

    this.current = new Employee();
    this.current.work = true;

    this.sidenav.open();
  }

  save() {
    this.sidenav.close();

    let saver: Observable<Employee>;

    if (this.current.id == null) {
      saver = this.employeeService.create(this.current);
    } else {
      saver = this.employeeService.update(this.current);
    }

    saver.subscribe(
      () => this.success(),
      () => this.error()
    );
  }

  remove(employee: Employee) {
    this.employees.delete(employee.id);

    this.employeeService.delete(employee.id).subscribe(
      () => this.success(),
      () => this.error()
    );
  }

  success() {
    this.showBar('SUCCESS');
  }

  error() {
    this.showBar('ERROR');
  }

  showBar(message: string) {
    this.snackBar.open(message, 'OK', {duration: 1000});
  }
}
