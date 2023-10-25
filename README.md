# Springbootjpaangular16

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


##############  how do I migrated this project from angular 8 to 16 ########################  


(1) download one latest angular project (for example, Angular 16.1.16) from angular website/git-site  

(2) compare its angular.json , package.json two files to my project two files  
and copy package.json and update my package json, and updated necessary part of my angular.json (few lines only)  

(3) deleted package-lock.json file, .angular, and node_modules folders in my project local  

(4) run:  npm install  

(5) run: npm install missing package (I can check the differences in package.json)  

(6) run:  npm list (important packages version) (such as: @angular/cli, @angular/webpack, @angular-devkit/build_angular, @angular-devkit/compiler, ....)  

(7) run:  ng serve, to fix error if any, and run webpack  

(8) debug it at browser side in app (loaded sources by browser such as chrome)  

(9) to resolve debug not working at Chrome/Edges (source code not loaded at top/webpack:// folder and webpack not loaded as source code);
compare angular.json two files and change "polyfills" field to following sample angular.json setting.
change to:  "polyfills": ["zone.js"],   "polyfills": ["zone.js", "zone.js/testing"],  


finally, run  




######### regarding polyfills.ts, without zone.js specified browser will not load source codes, below either way should work  

(1) add "polyfills": ["zone.js"] or   "polyfills": ["zone.js", "zone.js/testing"] in angular.json  

or  

(2) specify polyfills.ts location at tsconfig.ts (maybe angular.json file) and add content inside polyfills.ts:  

/**  

 * Zone JS is required by default for Angular itself.  

 */  

import 'zone.js';  // Included with Angular CLI.  




########## chnage ES2015 and 2018 to ES2022 in tsconfig file to remove warning  

 "target": "ES2022",  

    "lib": [  

      "es2022",  

      "dom"  
      
    ]

    ************** Test error ************************

      "allowJs": true, it will cause "Browser application bundle ....." error