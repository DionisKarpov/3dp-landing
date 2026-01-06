import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [CommonModule]
})
export class GalleryComponent {
  selectedImage: string | null = null;

  openImage(src: string) {
    this.selectedImage = src;
    document.body.style.overflow = 'hidden';
  }

  closeImage() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }
}
