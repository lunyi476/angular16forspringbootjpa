import { Component, OnInit, HostListener} from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [ RouterLink, RouterOutlet]
})
export class HomeComponent implements OnInit {

  constructor() { }
  counter = 0;
  @HostListener('window:keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.counter++;
    console.log(this.counter);
  }
  
  ngOnInit(): void {
  }

}
