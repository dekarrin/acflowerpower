import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ImagePreloaderService } from './image-preloader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AC FlowerPower';

  public constructor(private titleService: Title, private imagePreloaderService: ImagePreloaderService) {
    titleService.setTitle("AC FlowerPower");
  }

  ngOnInit(): void {
    this.imagePreloaderService.preloadFlowers().subscribe(() => {});
  }
}
