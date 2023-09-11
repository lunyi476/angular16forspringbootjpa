# Springbootjpaangular8

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

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


##############  how do I migrated this project from angular 9 to 16 ########################

(1) download one latest angular project from angular website/git-site
(2) compare its angular.json , package.json with my project two files
and copy package.json and update my package json, and updated necessary part of my angular.json (few lines only)
(3) deleted package-lock.json file, .angular, and node_modules folders in my project local
(4) run:  npm install
(5) run: npm install missing package (I can check the differences in package.json)
(6) run:  npm list (important packages version) (such as: @angular/cli, @angular/webpack, @angular-devkit/build_angular, @angular-devkit/compiler, ....)
(7) run:  ng serve to fix error if any, and run webpack
(8) debug it at browser side in app (loaded sources by browser such as chrome)
(9) to resolve debug not working at Chrome/Edges (source code not loaded at top/webpack:// folder and webpack not loaded as source code);
compare angular.json two files and change "polyfills" field to following sample angular.json setting.
change to:  "polyfills": ["zone.js"],   "polyfills": ["zone.js", "zone.js/testing"],

finally, run:   ng serve  and result as belows:



Thank you for sharing pseudonymous usage data. Should you change your mind, the following
command will disable this feature entirely:

    ng analytics disable

Global setting: enabled
Local setting: enabled
Effective status: enabled
? Port 4200 is already in use.
Would you like to use a different port? Yes
⠋ Generating browser application bundles (phase: setup)...    TypeScript compiler options "target" and "useDefineForClassFields" are set to "ES2022" and "false" respectively by the Angular CLI. To control ECMA version and features use the Browerslist configuration. For more information, see https://angular.io/guide/build#configuring-browser-compatibility
    NOTE: You can set the "target" to "ES2022" in the project's tsconfig to remove this warning.
✔ Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
vendor.js             | vendor        |   3.48 MB | 
styles.css, styles.js | styles        | 333.72 kB | 
polyfills.js          | polyfills     | 333.18 kB | 
main.js               | main          | 230.23 kB | 
runtime.js            | runtime       |   6.54 kB | 

                      | Initial Total |   4.36 MB

Build at: 2023-07-27T18:50:58.584Z - Hash: b6b01e25cb7f473b - Time: 8376ms

Warning: C:/angular_springboot_jpa/angular8forspringbootjpa/src/polyfills.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.

** Angular Live Development Server is listening on localhost:55351, open your browser on http://localhost:55351/ **




##############  I then removed all entries of polyfills in multiple fiels and deleted this polyfills.json file #####################
################  but keep change of angular.json to:  "polyfills": ["zone.js"],   "polyfills": ["zone.js", "zone.js/testing"]  without those two, Chrome will not load souce codes #####################

PS C:\angular_springboot_jpa\angular16forspringbootjpa> ng serve
? Port 4200 is already in use.
Would you like to use a different port? Yes
⠋ Generating browser application bundles (phase: setup)...    TypeScript compiler options "target" and "useDefineForClassFields" are set to "ES2022" and "false" respectively by the Angular CLI. To control ECMA version and features use the Browerslist configuration. For more information, see https://angular.io/guide/build#configuring-browser-compatibility
    NOTE: You can set the "target" to "ES2022" in the project's tsconfig to remove this warning.
✔ Browser application bundle generation complete.

Initial Chunk Files   | Names         |  Raw Size
vendor.js             | vendor        |   3.48 MB | 
styles.css, styles.js | styles        | 333.72 kB | 
polyfills.js          | polyfills     | 333.18 kB | 
main.js               | main          | 230.23 kB | 
runtime.js            | runtime       |   6.55 kB | 

                      | Initial Total |   4.36 MB

Build at: 2023-07-27T19:16:44.019Z - Hash: 68a677f9ef088267 - Time: 7981ms

** Angular Live Development Server is listening on localhost:55580, open your browser on http://localhost:55580/ **


√ Compiled successfully.



###########################  regarding polyfills.ts, either wa should work, without zone.js specified, browser will not load source codes ###########################
(1) "polyfills": ["zone.js"],   "polyfills": ["zone.js", "zone.js/testing"] at angular.json
or
(2) specify polyfills.ts location at tsconfig.ts (maybe angular.json file) and add content inside polyfills.ts: 
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.



################################chnage ES2015 and 2018 to ES2022 to remove warning ##########################
 "target": "ES2022",
    "lib": [
      "es2022",
      "dom"
    ]