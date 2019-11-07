import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDatePipe } from '../pipes/local-date-pipe.service';
import { LocalNumberPipe } from '../pipes/local-number-pipe.service';
import { SessionService } from '../session-service.service';



@NgModule({
  declarations: [
    LocalDatePipe,
    LocalNumberPipe,
    SessionService
  ],
  imports: [
    CommonModule
  ],
  exports:[
    LocalDatePipe,
    LocalNumberPipe,
    SessionService
  ]
})
export class LibLocaleModule { }
