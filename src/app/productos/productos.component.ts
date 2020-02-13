import { Component, OnInit } from '@angular/core';
import { PRODUCTOS_ARRAY } from '../Clases/productosArray';
import {Productos} from '../Clases/productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  private nombre1: Productos[];

  constructor() { }

  ngOnInit() {

  }

}
