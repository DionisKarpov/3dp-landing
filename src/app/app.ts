import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { AboutComponent } from './components/about/about.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AdvantagesComponent } from './components/advantages/advantages.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { FaqComponent } from './components/faq/faq.component';
import { ProcessComponent } from './components/process/process.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    AboutComponent,
    GalleryComponent,
    AdvantagesComponent,
    MaterialsComponent,
    FaqComponent,
    ProcessComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = '3dp-landing';
}
