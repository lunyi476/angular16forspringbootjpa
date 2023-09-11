import { Offers } from './offers';
import { ToFromJSon } from './tofromjson';



export interface Quotes  {
    request_no?: number;  // because server side set it as auto-generated
    owner: string;
    item: string;
    description?: string;
    requested_by: string;
    category?: string;
    item_class?: string;
    division?: string;
    brand?: string;  
    dept?: string;
    buyer?: string;
    request_price: number;
    currency?: string;
    delivery_terms?: string;
    import_cntry?: string;
    allocated_qty: number;
    modify_ts?: Date; // server set it
    modify_user?: string; // server set it

    offers : Offers[];
}


export const fieldNamesInQuote =['request_no','owner', 'item','description','requested_by', 'category','item_class',
                                 'division','brand', 'dept','buyer','request_price','currency','delivery_terms',
                                 'import_cntry','allocated_qty','modify_ts','modify_user','offers'];

// help class
export class CQuotes extends  ToFromJSon {
    request_no?: number;  // because server side set it as auto-generated
    owner: string;
    item: string;
    description?: string;
    requested_by: string;
    category?: string;
    item_class?: string;
    division?: string;
    brand?: string;  
    dept?: string;
    buyer?: string;
    request_price: number;
    currency?: string;
    delivery_terms?: string;
    import_cntry?: string;
    allocated_qty: number;
    modify_ts?: Date; // server set it
    modify_user?: string; // server set it
    offers : Offers[];

    constructor () { super();};

    setValue (name: string, val: any) : void {
        switch (name) {
            case 'request_no' : this.request_no = val; break; 
            case 'owner' : this.owner = val; break;
            case 'item' : this.item = val; break;
            case 'description' : this.description = val; break;
            case 'requested_by' : this.requested_by = val; break;
            case 'category' : this.category = val; break;
            case 'item_class' : this.item_class = val; break;
            case 'division' : this.division = val; break;
            case 'brand' : this.brand = val; break;
            case 'dept' : this.dept = val; break;
            case 'buyer' : this.buyer = val; break;
            case 'request_price' : this.request_price = val; break;
            case 'currency' : this.currency = val; break;
            case 'delivery_terms' : this.delivery_terms = val; break;
            case 'import_cntry' : this.import_cntry = val; break;
            case 'allocated_qty' : this.allocated_qty = val; break;
            case 'modify_ts' : this.modify_ts = val; break;
            case 'modify_user' : this.modify_user = val; break;
            case 'offers' : this.offers = val; break;
            default : break;
        }
    }


    getValue (name: string) : any {
        let val : any;
        switch (name) {
            case 'request_no' : val = this.request_no;  break;
            case 'owner' : val = this.owner; break;
            case 'item' : val = this.item; break;
            case 'description' : val = this.description; break;
            case 'requested_by' : val = this.requested_by; break;
            case 'category' : val = this.category; break;
            case 'item_class' : val = this.item_class; break;
            case 'division' : val = this.division; break;
            case 'brand' : val = this.brand; break;
            case 'dept' : val = this.dept; break;
            case 'buyer' : val = this.buyer; break;
            case 'request_price' : val = this.request_price; break;
            case 'currency' : val = this.currency; break;
            case 'delivery_terms' : val = this.delivery_terms; break;
            case 'import_cntry' : val = this.import_cntry; break;
            case 'allocated_qty' : val = this.allocated_qty; break;
            case 'modify_ts' : val = this.modify_ts; break;
            case 'modify_user' : val = this.modify_user; break;
            case 'offers' : val = this.offers; break;
            default : break;
        }

        return val;
    }

    toJSON(): Quotes {
        // copy all fields from `this` to an empty object and return 
        return Object.assign({}, this);
    }

    fromJSON(json: Quotes|string): CQuotes {
        if (typeof json === 'string') {
          // if it's a string, parse it first
          return JSON.parse(json, CQuotes.reviver);
        } else {
          // create an instance of the User class
          let cquotes = Object.create(CQuotes.prototype);
          // copy all the fields from the json object
          return Object.assign(cquotes, json, {
            // convert fields that need converting        
            //request_no: Number(json.request_no),
            //request_price: Number(json.request_price),
            //allocated_qty: Number(json.allocated_qty)
          });
        }
      }
    
    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call CQuotes.fromJSON on the resulting value.
    static reviver(key: string, value: any): any {
      return key === "" ? new CQuotes().fromJSON(value) : value;
    }
    
}

// cannot be loaded in testing
export const testquotedata: Quotes =  { request_no: 1, owner: 'Bamboorose',item: 'food', description: 'testing', requested_by: 'Lun Yi', 
    request_price: 10, currency: 'USD', delivery_terms: '07/30/2020', allocated_qty: 100, 
    category: '',item_class:'',division:'',brand:'',dept:'',buyer:'', import_cntry:'', 
    offers: [
      { offer_no : 1, owner : 'Bamboorose' , item : 'food' ,request_no : 1 ,  description : 'food supply' , offer_date : new Date(2020, 7, 31) ,status : 
      'open', buyer : 'Lun Yi' ,supplier :  'Stop Shop',vendor_name : 'Stop Shop' ,manufacturer :  'Tyson',
      carrier :  'Carrier',delivery_terms : '' ,payment_type : '' ,payment_terms : '' ,currency : 'USD' ,origin_cntry : '' ,first_ship_date : null ,
      last_ship_date : null ,lading_point : null ,final_dest : null, quote: null  }, 
      {offer_no : 2, owner : 'Bamboorose' , item : 'beef' ,request_no : 1 ,  description : 'beef supply', offer_date :  new Date(2020, 7, 30) ,status : 
      'open', buyer : 'Lun Yi' ,supplier :  'Stop Shop',vendor_name : 'Stop Shop' ,manufacturer :  'Tyson',
      carrier :  'Carrier',delivery_terms : '' ,payment_type : '' ,payment_terms : '' ,currency : 'USD' ,origin_cntry : '' ,first_ship_date : null ,
      last_ship_date : null ,lading_point : null ,final_dest : null, quote: null }
]} ;

export const testquotesdata : Quotes[] =    [{ request_no: 1, owner: 'Bamboorose',item: 'food', description: 'testing', requested_by: 'Lun Yi2', 
  request_price: 10, currency: 'USD', delivery_terms: '07/30/2020', allocated_qty: 100,   
  offers : null},
  { request_no: 2, owner: 'Bamboorose',item: 'beef', description: 'testing', requested_by: 'Lun Yi3', 
  request_price: 10, currency: 'USD', delivery_terms: '07/30/2020', allocated_qty: 100,   
  offers : null},
  { request_no: 3, owner: 'Bamboorose',item: 'chicken', description: 'testing', requested_by: 'Lun Yi4', 
  request_price: 10, currency: 'USD', delivery_terms: '07/30/2020', allocated_qty: 100,   
  offers : null} ];    
                    
