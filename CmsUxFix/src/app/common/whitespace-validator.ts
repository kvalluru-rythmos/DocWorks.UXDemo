import { FormControl } from '@angular/forms';

export function WhiteSpaceValidator(control: FormControl) {
  const isValid = ((control.value || '').length > (control.value || '').trim().length) ? false : true;
  return isValid ? null : { 'whitespace': true };
}
