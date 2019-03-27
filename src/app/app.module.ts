import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Homepage with Upload option */
import { HomeComponent } from './home/home.component';

/* Image option menu */
import { ImageMenuComponent } from './imagemenu/imagemenu.component';

/* Image canvas (child of ImageMenuComponent) */
import { ImageCanvasComponent } from './imagemenu/imagecanvas/imagecanvas.component';

/* Save image button (child of ImageMenuComponent) */
import { SaveimageComponent } from './imagemenu/saveimage/saveimage.component';

/* Bitplane Browser Component (child of ImageMenuComponent) */
import { BitPlaneBrowserComponent } from './imagemenu/bitplane-browser/bitplane-browser.component';

/* Extract Data Menu */
import { ExtractMenuComponent } from './embed-extract-data/extract-menu/extract-menu.component';

/* Bit Table, for the Extract & Embed Data Menus */
import { LsbTableComponent } from './embed-extract-data/lsb-table/lsb-table.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ImageMenuComponent,
    ImageCanvasComponent,
    SaveimageComponent,
    BitPlaneBrowserComponent,
    ExtractMenuComponent,
    LsbTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
