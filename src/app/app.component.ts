import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from './employee-service';
import {Employee} from './employee';
import {MatIconRegistry, MatSidenav, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {DomSanitizer} from '@angular/platform-browser';
import {EmployeeActivity} from './employee-activity';

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
  loader = true;
  formError = false;

  activities = EmployeeActivity;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'git-hub-svg',
      sanitizer.bypassSecurityTrustResourceUrl('assets/github.svg')
    );

    this.employees = [];
    this.removed = [];

    this.current = new Employee();
  }

  ngOnInit(): void {
    this.employeeService.stream();

    this.employeeService.all().subscribe(data => {
      this.employees = data;
      this.loader = false;

      this.watch();
    });
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

    this.formError = false;
    this.sidenav.toggle();
  }

  add() {
    this.addMode = true;
    this.loader = false;

    this.current = new Employee();

    this.current.hired = new Date();
    this.current.work = true;

    this.sidenav.open();
  }

  save() {
    if (this.invalid(this.current)) { return; }

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

  invalid(employee: Employee) {
    const a = employee.name && employee.name !== '';
    const b = employee.position && employee.position !== '';
    const c = employee.salary && employee.salary > 0;

    this.formError = !a || !b || !c;

    return this.formError;
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

  gitHub() {
    window.open('https://github.com/TheTOXIN/ReactiveServerCRUD', '_blank');
  }
}
