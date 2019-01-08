import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule
} from '@angular/material';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faBars,
  faEdit,
  faPlus,
  faSearch,
  faSignOutAlt,
  faTimes,
  faTrashAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

import { CookieModule } from 'ngx-cookie';

// Snippets
import { ScrollArrowComponent } from './main/snippets/scroll-arrow/scroll-arrow.component';

// Icons for fontawesome library
library.add(faArrowDown);
library.add(faBars);
library.add(faEdit);
library.add(faPlus);
library.add(faSearch);
library.add(faSignOutAlt);
library.add(faTimes);
library.add(faTrashAlt);
library.add(faUserPlus);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    FontAwesomeModule,
    CookieModule.forRoot()
  ],
  declarations: [
    ScrollArrowComponent
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    FontAwesomeModule,
    CookieModule,
    ScrollArrowComponent
  ]
})
export class AppSharedModule { }
