//! Importing modules
import { Base } from "./App/Base.js";

export class App {
  static init() {
    this.theBase = new Base();
  }

  static getDataCls() {
    return this.theBase.data;
  }
}
App.init();
