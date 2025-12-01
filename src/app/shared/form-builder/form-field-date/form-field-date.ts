import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-form-field-date',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, KeyValuePipe],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form-field-date.html',
  styleUrl: './form-field-date.scss',
})
export class FormFieldDate extends PrimitiveFormField {}
