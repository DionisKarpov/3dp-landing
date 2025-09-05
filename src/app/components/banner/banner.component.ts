import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  imports: [CommonModule]
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
