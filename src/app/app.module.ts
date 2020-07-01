import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CalendarComponent} from './calendar/calendar.component';
import {OrganizerComponent} from './organizer/organizer.component';
import {DateSelectorComponent} from './date-selector/date-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    OrganizerComponent,
    DateSelectorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
