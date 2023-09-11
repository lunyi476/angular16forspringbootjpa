export abstract class ToFromJSon {
    constructor () {};
    abstract toJSON(): Object;   
    abstract fromJSON(json: Object|string): Object;
}