import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ImageMenuComponent } from './imagemenu/imagemenu.component';
import { ExtractMenuComponent } from './embed-extract-data/extract-menu/extract-menu.component';
import { EmbedMenuComponent } from './embed-extract-data/embed-menu/embed-menu.component';
import { EmbedImageComponent } from './embed-image/embed-image.component';

const routes: Routes = [
  { path : '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: UploadComponent },
  { path: 'checklist', component: ChecklistComponent },
  { path: 'image', component: ImageMenuComponent },
  { path: 'extract', component: ExtractMenuComponent },
  { path: 'embed', component: EmbedMenuComponent },
  { path: 'embedimage', component: EmbedImageComponent },
	{ path: '**', redirectTo: '/upload' } // If 404, redirect back to upload screen
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }