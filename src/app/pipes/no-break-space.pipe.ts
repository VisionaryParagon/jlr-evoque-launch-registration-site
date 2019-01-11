import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noBreakSpace'
})
export class NoBreakSpacePipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      return value.split(' ').join(String.fromCharCode(160));
    } else {
      return null;
    }
  }

}
