import { Component, signal, computed, Signal, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProcessSlide = {
  title: string;
  image: string;
  alt?: string;
};

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  imports: [CommonModule]
})
export class ProcessComponent {
  @ViewChild('viewport', { static: true }) viewportRef!: ElementRef<HTMLElement>;
  @ViewChild('strip', { static: true }) stripRef!: ElementRef<HTMLElement>;

  initialIndex = 0;
  index = signal(this.initialIndex);
  knobX = signal(0);
  cardGap = 24;
  cardWidth = 282;
  cardHeight = 383;
  trackPadding = 24;
  stripStartX = 0;
  stripMoved = false;
  _slides = signal<ProcessSlide[]>([
    { title: 'Модель', image: 'assets/images/process/1.webp', alt: '3D модель' },
    { title: 'Друк', image: 'assets/images/process/2.webp', alt: 'Друк' },
    { title: 'Пост-обробка', image: 'assets/images/process/3.webp', alt: 'Пост-обробка' },
    { title: 'Збірка', image: 'assets/images/process/4.webp', alt: 'Збірка' },
    { title: 'Готова модель', image: 'assets/images/process/5.webp', alt: 'Готова модель' },
    { title: 'Пост-обробка', image: 'assets/images/process/1.webp', alt: 'Пост-обробка' },
    { title: 'Збірка', image: 'assets/images/process/2.webp', alt: 'Збірка' },
    { title: 'Готова модель', image: 'assets/images/process/3.webp', alt: 'Готова модель' },
  ]);
  slidesSig: Signal<ProcessSlide[]> = this._slides;
  count = computed(() => this._slides().length);
  trackLeft = computed(() => this.trackStart());
  

  private pointerId?: number;
  private dragStartX = 0;
  private dragStartIndex = 0;

  private minSwipePx(): number {
    const stepX = this.trackWidth() / Math.max(1, this.count() - 1);
    return Math.max(20, stepX * 0.12);
  }

  get translateX(): string {
    const n = this.count();
    const w = this.cardWidth;
    const gap = this.cardGap;
    const step = w + gap;
    const contentW = n * w + (n - 1) * gap;
    const maxOffset = Math.max(0, contentW - 1200);
    const rawOffset = this.index() * step;
    const clamped = Math.min(Math.max(rawOffset, 0), maxOffset);

    return `translateX(${-Math.round(clamped)}px)`;
  }

  get knobStyle(): any {
    return { left: `${this.knobX()}px` };
  }

  get mathCount(): number {
    return Math.max(1, this.count()-1)
  }

  private removeMove?: () => void;
  private removeUp?: () => void;

  constructor(private el: ElementRef<HTMLElement>, private r2: Renderer2) {}

  onKnobPointerDown(ev: PointerEvent) {
    ev.preventDefault();
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
    this.pointerId = ev.pointerId;

    const { left } = this.trackMetrics();
    this.dragStartX = ev.clientX - left;
    this.dragStartIndex = this.index();

    const move = (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;
      const rel = e.clientX - left;
      const clamped = Math.max(0, Math.min(rel, this.trackWidth()));
      this.knobX.set(clamped); 
    };

    const up = (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;

      const dx = this.knobX() - this.dragStartX;
      const thr = this.minSwipePx();

      if (dx > thr) {
        this.goTo(this.dragStartIndex + 1);
      } else if (dx < -thr) {
        this.goTo(this.dragStartIndex - 1);
      } else {
        const idx = this.nearestIndexByX(this.knobX());
        this.goTo(idx);
      }

      this.detachDrag();
      this.pointerId = undefined;
    };

    this.removeMove = this.r2.listen('document', 'pointermove', move);
    this.removeUp   = this.r2.listen('document', 'pointerup',   up);
  }

  goTo(i: number) {
    const idx = Math.max(0, Math.min(i, this.count() - 1));
    this.index.set(idx);
    this.knobX.set(Math.round(idx * this.stepX()));
  }

  prev(): void {
    this.goTo(this.index() - 1);
  }

  next(): void {
    this.goTo(this.index() + 1);
  }

  private detachDrag() {
    if (this.removeMove) { this.removeMove(); this.removeMove = undefined; }
    if (this.removeUp)   { this.removeUp();   this.removeUp = undefined; }
  }

  private stepX(): number {
    const steps = Math.max(1, this.count() - 1);
    return this.trackWidth() / steps;
  }

  private trackEl(): HTMLElement {
    return this.el.nativeElement.querySelector('.process__track') as HTMLElement;
  }

  private trackMetrics() {
    const rect = this.trackEl().getBoundingClientRect();
    return { left: rect.left, x: rect.x, width: rect.width };
  }

  private trackWidth(): number {
    return this.trackEl().clientWidth;
  }

  private trackStart(): number {
    return this.trackPadding;
  }

  private nearestIndexByX(x: number): number {
    const steps = Math.max(1, this.count() - 1);
    const stepX = this.trackWidth() / steps;
    return Math.round(x / stepX);
  }
}