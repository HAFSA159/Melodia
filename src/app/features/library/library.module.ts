import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './library.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LibraryComponent
  ],
  imports: [
    CommonModule,
    LibraryRoutingModule,
    ReactiveFormsModule
  ]
})
export class LibraryModule { }
