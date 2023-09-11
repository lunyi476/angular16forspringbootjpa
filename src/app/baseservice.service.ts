import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class BaseserviceService {

  constructor(private messageService: MessageService) { }

  handleError<T>(operation = 'operation', result?: T) { // result may not useful
    return (error: any, response: any): Observable<T> => {
      // $() not working, put error in message service for retrieving if need
      this.log(operation + 'failed: ' + error.message + '  '+ error.error);
     /**  
      * response is for error which has operator and caught and useless
      * return error as Observable for next subscriber to handle  
      */
      return of(error);
    };
  }

  protected log(message: string) {
    this.messageService.add(message);
  }
}
