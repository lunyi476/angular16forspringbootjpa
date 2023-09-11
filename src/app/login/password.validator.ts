import { Directive, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/** A userName can't match the password, cross-field validation */
export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const userName = control.get('userName'); // return FormControl
  const password = control.get('password');

  return userName && password && userName.value === password.value && userName.value !='' ? { 'identityRevealed': true } : null;
};

@Directive({
  selector: '[appIdentityRevealed]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IdentityRevealedValidatorDirective, multi: true }]
})
export class IdentityRevealedValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return identityRevealedValidator(control)
  }
}

