import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { APP_INITIALIZER } from '@angular/core';
import { SignalrService } from './signalr.service';
import { AppComponent } from './app.component';
import { VideocallComponent } from './videocall/videocall.component';

@NgModule({
  declarations: [AppComponent, VideocallComponent],
  imports: [BrowserModule],
  providers: [
    SignalrService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalrService: SignalrService) => () =>
        signalrService.initiateSignalrConnection(),
      deps: [SignalrService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
