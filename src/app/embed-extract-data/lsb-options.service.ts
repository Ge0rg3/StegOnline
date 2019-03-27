import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LsbOptionsService {

   //The selected R, G, B and A bits
  selectedBits = {'r': [], 'g': [], 'b': [], 'a': []};

  constructor() { }
}
