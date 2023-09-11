import { Injectable } from '@angular/core';
import { HttpClient,  HttpResponse,HttpParams, HttpHeaders} from '@angular/common/http';

import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Quotes } from './quotes';
import { BaseserviceService } from './baseservice.service';
import { LogInfor } from './login/loginfor';
import { Orders } from './orders';
import { Offers } from './offers';

/**
 * @author: lyi
 * 08/2020
 */                            
/** handle communication to server side */
@Injectable({
  providedIn: 'root'
})
export class HttptoserverService extends BaseserviceService {
  baseUrl = 'http://localhost:5000';  // spring boot server
 
  constructor( public http: HttpClient, messageServiceChild: MessageService) {
    super(messageServiceChild); 
   }


  getQuotes(): Observable<Quotes[]> {
    return this.http.get<Quotes[]> (this.baseUrl+'/listquotes');
  }


  getQuote(id: number): Observable<Quotes> {
    let httpParams = new HttpParams();
    // HttpParams workes only with string value
    httpParams = httpParams.set('request_no', id.toString());
    return this.http.get<Quotes>(this.baseUrl+'/getquote', {params: httpParams });
  }


  deleteQuote(quote: Quotes): Observable<HttpResponse<any>> {
     return this.http.delete (this.baseUrl+'/deletequote?request_no='+quote.request_no,  
     {observe: 'response',responseType: 'json'})
     .pipe(catchError(this.handleError<HttpResponse<any>>("deleteQuote"))); 
  }


  saveQuote (quote: Quotes): Observable<HttpResponse<any>> { 
    let h = new HttpHeaders();
    
    if (!quote.request_no) {// null, undefined, ""
      // HttpParams Object is immutable
      h = h.append('reqaction', 'new');
    }
    else {
      h = h.append('reqaction', 'save');
    }
    
    return this.http.post<Quotes>( this.baseUrl+'/savequote', quote, { headers: h,
      observe: 'response', responseType: 'json'})
      .pipe( 
        catchError(this.handleError<HttpResponse<any>>("saveQuote"))
    ); 
   
  }
  

  register(userData: LogInfor) : Observable<any> { 
    return this.http.get( this.baseUrl+'/enroll?userName='+userData.userName+
    '&password='+userData.password,{  observe: 'response', responseType: 'json'}
    );
  }
 

  getOrders(): Observable<Orders[]> {
    return this.http.get<Orders[]> (this.baseUrl+'/listorders');
  }


  getOrder(id: number): Observable<any> {
    let httpParams = new HttpParams();
    // HttpParams workes only with string value
    httpParams = httpParams.set('order_no', id.toString());
    return this.http.get<Orders>(this.baseUrl+'/getorder', {params: httpParams });
  }


  deleteOrder(order: Orders): Observable<HttpResponse<any>> {
     return this.http.delete (this.baseUrl+'/deleteorder?order_no='+order.order_no,  
     {observe: 'response',responseType: 'json'})
     .pipe(
       catchError(this.handleError<HttpResponse<any>>("deleteOrder"))
       ); 
  }


  saveOrder (order: Orders): Observable<HttpResponse<any>> { 
    let h = new HttpHeaders();
    
    if (!order.order_no) {
      h = h.append('reqaction', 'new');
    }
    else {
      h = h.append('reqaction', 'save');
    }
    
    return this.http.post<Orders>( this.baseUrl+'/saveorder', order, { headers: h,
      observe: 'response', responseType: 'json'})
    .pipe( 
        catchError(this.handleError<HttpResponse<any>>("saveOrder"))
    ); 
  }


  getOffers() : Observable<Offers[]> {
    return this.http.get<Offers[]> (this.baseUrl+'/listoffers');
  }

}
