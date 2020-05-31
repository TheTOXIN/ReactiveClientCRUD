import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from './Employee';

@Injectable()
export class EmployeeService {

  public employeesBehavior: BehaviorSubject<Employee>;
  public employeesObservable: Observable<Employee>;

  private URL = 'http://localhost:8080';

  constructor(
    private http: HttpClient
  ) {
    this.employeesBehavior = new BehaviorSubject(null);
    this.employeesObservable = this.employeesBehavior.asObservable();
  }

  public create() {

  }

  public read() {

  }

  public update() {

  }

  public delete() {

  }

  public stream() {
    const streamURL = this.URL + '/stream';
    const eventSource = new EventSource(streamURL);

    eventSource.addEventListener('employees', (event: any) => {
      const employee = JSON.parse(event.data) as Employee;
      this.employeesBehavior.next(employee);
    });
  }
}
