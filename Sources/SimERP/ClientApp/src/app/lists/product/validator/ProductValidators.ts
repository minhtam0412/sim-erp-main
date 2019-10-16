import {AbstractControl, ValidationErrors} from '@angular/forms';

export class ProductValidators {
  static TextAreaShouldBeValid(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return {shouldNotHaveSpaces: true};
    }

    // If there is no validation failure, return null
    return null;
  }
}
