import { FormControl } from '@angular/forms';
 
export class NumberValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                "Not a number": true
            };
        }
 
        return null;
    }
 
}

export class EmailValidator {
 
  static emailPattern = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,4}";
 
}

export class PasswordValidator {
 
  static passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]){4,8}$/;
 
}