import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ImageOptionsComponent } from './imageoptions/imageoptions.component';
import { ImageCanvasComponent } from './imageoptions/imagecanvas/imagecanvas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImageOptionsComponent,
    ImageCanvasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
