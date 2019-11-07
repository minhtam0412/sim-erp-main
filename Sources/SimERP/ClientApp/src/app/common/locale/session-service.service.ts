import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { Pipe } from '@angular/core';
import { Key_Locale } from '../config/globalconfig';
import localeUs from '@angular/common/locales/es-US';
import localeVi from '@angular/common/locales/vi';

@Pipe({
  name: 'SessionService'
})

@Injectable({ providedIn: 'root' })
export class SessionService {
  private _locale: string;

  constructor() {
    this.registerCulture(Key_Locale);
  }

  set locale(value: string) {
    this._locale = value;
  }

  get locale(): string {
    return this._locale || 'vi';
  }

  registerCulture(culture: string) {
    if (!culture) {
      return;
    }
    this.locale = culture;

    // Register locale data since only the en-US locale data comes with Angular
    switch (culture) {
      case 'es-US': {
        registerLocaleData(localeUs);
        break;
      }
      case 'vi': {
        registerLocaleData(localeVi);
        break;
      }
    }
  }
}