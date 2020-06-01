import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  log(msg: any) {
    console.log(new Date() + ": " + JSON.stringify(msg));
  }

  error(msg: any) {
    console.error(new Date() + ": " + JSON.stringify(msg));
  }

  info(msg: any) {
    console.info(new Date() + ": " + JSON.stringify(msg));
  }

  warn(msg: any) {
    console.warn(new Date() + ": " + JSON.stringify(msg));
  }

  debug(msg: any) {
    console.debug(new Date() + ": " + JSON.stringify(msg));
  }
}
