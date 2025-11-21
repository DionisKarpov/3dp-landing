import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
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
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ModalService } from './services/modal.service';

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
    ProcessComponent,
    ModalModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild('contactUsTemplate') contactUsTemplate!: TemplateRef<void>;
  @ViewChild('termsTemplate') termsTemplate!: TemplateRef<void>;
  @ViewChild('policyTemplate') policyTemplate!: TemplateRef<void>;
  protected title = '3dp-landing';
  private modalService = inject(ModalService);
  private bsModalService = inject(BsModalService);

  bsModalRef?: BsModalRef;
  
  constructor() {
    this.modalService.toOpenModal.subscribe(templateName => {
      if (templateName) {
        const template = templateName === 'contactUsTemplate' ? this.contactUsTemplate : 
                         templateName === 'termsTemplate' ? this.termsTemplate : this.policyTemplate;
        this.openModal(template);
      } else {
        this.closeModal();
      }
    });
  }

  openModal(template: TemplateRef<void>) {
    this.bsModalRef = this.bsModalService.show(template);
  }

  closeModal() {
    console.log('qweqwe');
    
    this.bsModalRef?.hide();
  }
}
