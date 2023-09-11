import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarService implements OnInit{
  links2 = new Array<{text: string, path:string}>();
  /**
   * A Subject is simultaneously two elements, a subscriber and an observable. 
   * As a subscriber, a subject can be used to publish the events coming 
   * from more than one observable.
   * And because it's also observable, the events from multiple subscribers 
   * can be reemitted as its events to anyone observing it.       
   **/ 
  isLoggedIn = new Subject<number>();

  constructor() { 
    this.addMenu('Quote', 'quote');
    this.addMenu('Order', 'order');
    /**
     * notify/call callback of Subscriber/Observer and initial to unlogged state.
     * Observable cannot do this.
     **/ 
    this.isLoggedIn.next(0);
  }

  ngOnInit () {}

  getMenus () : Array<{text: string, path:string}> {
    return this.links2;
  }

  getLogStatus () : Subject<number> {
    // app.component will subscribe to this Observable
    return this.isLoggedIn
   }

  addMenu (text: string, path: string): void {
    this.links2.push({text: text, path: path});
  }

  updateMenu (text: string) : void {   
    if (text == "home" || text =="" || text == "login") {
      this.clearMenus();
      this.addMenu('Quote', 'quote');
      this.addMenu('Order', 'order');
    } else if (text == "quote") {
      this.clearMenus();
      this.addMenu('Home', 'home');
      this.addMenu("New Quote", "newquote");
      this.addMenu("Save", "savequote");
      this.addMenu("Delete", "deletequote");
      this.addMenu("Add Offer", "addoffer");
      this.addMenu("Select Quote", "selectobject");
    } else if (text == "order") {
      this.clearMenus();
      this.addMenu('Home', 'home');
      this.addMenu("Build Order", "buildorder");
      this.addMenu("Save", "saveorder");
      this.addMenu("Delete", "deleteorder");
      this.addMenu("Select Order", "selectobject");
    } 
  }

  removeMenu({ text }): void {
    this.links2.forEach((link, index) => {
      if (link.text === text) {
        this.links2.splice(index, 1);
      }
    });
  }

  updateLoginStatus(status: number) {
    // Subscribe will receive this new value to update logging ststae
    this.isLoggedIn.next(status);
  }

  clearMenus () {
    this.links2.length = 0;
  }
}
