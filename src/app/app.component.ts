import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ImagePreloaderService } from './image-preloader.service';
import { Router, NavigationEnd } from '@angular/router';
import { LogService } from './log.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AC FlowerPower';

  public constructor(
    private titleService: Title,
    private imagePreloaderService: ImagePreloaderService,
    private router: Router,
    private logger: LogService)
  {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => this.imagePreloaderService.preloadFlowersAsync(() => {}, () => {}));
    titleService.setTitle("AC FlowerPower");
  }

  ngOnInit(): void {
  }
}
