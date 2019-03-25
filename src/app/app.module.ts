import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ImageMenuComponent } from './imagemenu/imagemenu.component';
import { ImageCanvasComponent } from './imagemenu/imagecanvas/imagecanvas.component';
import { SaveimageComponent } from './imagemenu/saveimage/saveimage.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImageMenuComponent,
    ImageCanvasComponent,
    SaveimageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
