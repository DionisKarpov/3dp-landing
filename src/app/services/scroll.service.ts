import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  scrollToElement(elementId: string): void {
    if (!this.isBrowser) return;

    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = 80; // Висота фіксованого header
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  getCurrentSection(): string {
    if (!this.isBrowser) return 'banner';

    const sections = ['banner', 'advantages', 'process', 'materials', 'gallery', 'faq', 'about'];
    const headerHeight = 64;
    
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerHeight + 24) {
          return sections[i];
        }
      }
    }
    return 'banner';
  }
}