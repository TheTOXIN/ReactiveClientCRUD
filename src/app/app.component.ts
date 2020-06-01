import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './employee-service';
import {Employee} from './employee';
import {MatSidenav, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({transform: 'scale(0.975)'}),
        animate('0.5s', keyframes([
          style({transform: 'scale(0.975)'}),
          style({transform: 'scale(1.025)'}),
          style({transform: 'scale(1)'})
        ]))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;

  public current: Employee;

  public employees: Employee[];
  public removed: Employee[];

  addMode = true;
  loader = false;

  constructor(
    public employeeService: EmployeeService,
    public snackBar: MatSnackBar
  ) {
    this.employees = [];
    this.removed = [];

    this.current = new Employee();
  }

  ngOnInit(): void {
    this.employeeService.stream();
    this.watch();
  }

  watch() {
    this.employeeService.employeesObservable.subscribe(data => {
      if (data == null || this.removed[data.id]) {
        return;
      }

      const index = this.index(data);

      if (index < 0) {
        this.employees.unshift(data);
      } else {
        this.employees[index] = data;
      }
    });
  }

  open(employee: Employee) {
    this.addMode = false;
    this.loader = true;

    this.employeeService.read(employee.id).subscribe(data => {
      this.current = data;
      this.loader = false;
    }, () => {
      this.sidenav.toggle();
      this.showBar('NOT EXIST');
      this.clear(this.index(employee));
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
    this.loader = true;

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

  remove(index: number, employee: Employee) {
    this.loader = true;

    this.removed[employee.id] = employee;
    this.clear(index);

    this.employeeService.delete(employee.id).subscribe(
      () => this.success(),
      () => this.error()
    );
  }

  index(search: Employee): number {
    return this.employees.findIndex(employee => employee.id === search.id);
  }

  clear(index: number) {
    this.employees.splice(index, 1);
  }

  success() {
    this.showBar('SUCCESS');
  }

  error() {
    this.showBar('ERROR');
  }

  showBar(message: string) {
    this.snackBar.open(message, 'OK', {duration: 1000});
    this.loader = false;
  }
}
