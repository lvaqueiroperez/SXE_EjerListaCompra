import {Component, OnInit} from '@angular/core';
import {PRODUCTOS_ARRAY} from '../Clases/productosArray';
import {Productos} from '../Clases/productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  selectedProducto: Productos;

  productosA = PRODUCTOS_ARRAY;

  constructor() {
  }

  ngOnInit() {

  }
  // función que usaremos en el evento "click" para asignar a la variable "selectedProducto" el producto seleccionado
  onSelect(producto: Productos): void {
    this.selectedProducto = producto;
  }

}
