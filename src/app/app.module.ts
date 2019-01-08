import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App modules
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared.module';
import { MainModule } from './main/main.module';

// App components
import { AppComponent } from './app.component';

// Modal components

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppSharedModule,
    MainModule
  ],
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
