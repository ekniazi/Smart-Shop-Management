import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowserviceService {

  get windowRef() {
    return window
  }
  constructor() { }
}
