import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'fraction'
})
export class FractionPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    // نبحث عن جميع الكسور في النص
    const fractionRegex = /\d+⁄\d+|\d+\/\d+/g;
    return this.sanitizer.bypassSecurityTrustHtml(
      value.replace(fractionRegex, (match) => {
        const parts = match.split(/[\/⁄]/); // يقبل كلاً من / و ⁄
        if (parts.length === 2) {
          const [numerator, denominator] = parts;
          return `
            <span style="display: inline-block; text-align: center; line-height: 1;">
              <span>${numerator}</span><br />
              <span style="border-top: 2px solid #000; display: block;">${denominator}</span>
            </span>
          `;
        }
        return match; // لو مش كسر نرجع النص زي ما هو
      })
    );
  }
}
