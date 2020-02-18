import {Component, OnInit} from '@angular/core';
import {PRODUCTOS_ARRAY} from '../Clases/productosArray';
import {Productos} from '../Clases/productos';
import {PRODUCTOSSELEC_ARRAY} from '../Clases/productosSelecArray';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  selectedProducto: Productos;
  selectedProducto2: Productos;

  productosA = PRODUCTOS_ARRAY;

  productosSelecA = PRODUCTOSSELEC_ARRAY;

  constructor() {
  }

  ngOnInit() {

  }

  // función que usaremos en el evento "click" para asignar a la variable "selectedProducto" el producto seleccionado
  onSelect(producto: Productos, index): void {
    this.selectedProducto = producto;
    producto.comprado = true;
    this.productosSelecA.push(producto);
    this.productosA.splice(index, 1);

  }

  // función usada por el segundo evento "click" para asignar a la variable "selectedProducto2" el producto seleccionado
  // esta función es usada con los productos seleccionados
  onSelect2(producto: Productos, index): void {
    this.selectedProducto2 = producto;
    producto.comprado = false;
    this.productosA.push(producto);
    this.productosSelecA.splice(index, 1);

  }

}
