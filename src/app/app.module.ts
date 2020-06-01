import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatChipsModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule, MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {EmployeeService} from './employee-service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    EmployeeService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
