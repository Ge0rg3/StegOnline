import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ImageMenuComponent } from './imagemenu/imagemenu.component';
import { ImageCanvasComponent } from './imagemenu/imagecanvas/imagecanvas.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImageMenuComponent,
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
