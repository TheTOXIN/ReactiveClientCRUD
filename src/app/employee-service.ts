import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from './Employee';

@Injectable()
export class EmployeeService {

  public employeesBehavior: BehaviorSubject<Employee>;
  public employeesObservable: Observable<Employee>;

  private URL = 'http://localhost:8080';
  private EMPLOYEE_URL = this.URL + '/employees';

  constructor(
    private http: HttpClient
  ) {
    this.employeesBehavior = new BehaviorSubject(null);
    this.employeesObservable = this.employeesBehavior.asObservable();
  }

  public create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.EMPLOYEE_URL, employee).pipe();
  }

  public read(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.EMPLOYEE_URL}/${id}`).pipe();
  }

  public update(employee: Employee) {
    return this.http.put<Employee>(`${this.EMPLOYEE_URL}/${employee.id}`, employee).pipe();
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.EMPLOYEE_URL}/${id}`).pipe();
  }

  public all(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.EMPLOYEE_URL).pipe();
  }

  // Deprecated
  public stream() {
    const streamURL = this.URL + '/stream';
    const eventSource = new EventSource(streamURL);

    eventSource.addEventListener('employees', (event: any) => {
      const employee = JSON.parse(event.data) as Employee;
      this.employeesBehavior.next(employee);
    });
  }

  // https://stackoverflow.com/questions/20123762/what-the-difference-between-onmessage-and-addeventlistener
  public testStream(): Observable<Employee> {
    return new Observable<Employee>((observe) => {
      const streamURL = this.URL + '/stream';
      const eventSource = new EventSource(streamURL);

      eventSource.onmessage = (event) => {
        const employee = JSON.parse(event.data) as Employee;
        observe.next(employee);
      };
    });
  }
}
