import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Employee} from './Employee';

@Injectable()
export class EmployeeService {

  private hiredEmployeesBehavior: BehaviorSubject<Employee>;
  public hiredEmployeesObservable: Observable<Employee>;

  private firedEmployeesBehavior: BehaviorSubject<Employee>;
  public firedEmployeesObservable: Observable<Employee>;

  private URL = 'http://localhost:8080';
  private EMPLOYEE_URL = this.URL + '/employees';

  constructor(
    private http: HttpClient
  ) {
    this.hiredEmployeesBehavior = new BehaviorSubject(null);
    this.hiredEmployeesObservable = this.hiredEmployeesBehavior.asObservable();

    this.firedEmployeesBehavior = new BehaviorSubject(null);
    this.firedEmployeesObservable = this.firedEmployeesBehavior.asObservable();
  }

  public stream() {
    const streamURL = this.URL + '/stream';
    const eventSource = new EventSource(streamURL);

    eventSource.addEventListener('hired-employee', (event: any) => {
      const employee = JSON.parse(event.data) as Employee;
      this.hiredEmployeesBehavior.next(employee);
    });

    eventSource.addEventListener('fired-employee', (event: any) => {
      const employee = JSON.parse(event.data) as Employee;
      console.log('FIRED: ' + employee.name);
      this.firedEmployeesBehavior.next(employee);
    });
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
}
