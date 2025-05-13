import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fraction'
})
export class FractionPipe implements PipeTransform {

  toArabic(num: string): string {
    return num.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
  }

  transform(value: string): string {
    // بيحوّل كل حاجة زي 1\2 إلى شكل كسر HTML
    return value.replace(/(\d)\\(\d)/g, (_match, numerator, denominator) => {
      return `<sup>${this.toArabic(numerator)}</sup>&frasl;<sub>${this.toArabic(denominator)}</sub>`;
    });
  }

}
