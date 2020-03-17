import {Component, OnInit} from '@angular/core';
import {PRODUCTOS_ARRAY} from '../Clases/productosArray';
import {Productos} from '../Clases/productos';
import {PRODUCTOSSELEC_ARRAY} from '../Clases/productosSelecArray';
// PARA PODER USAR LAS VARIABLES DEL OTRO COMPONENTE
import {ServicioDeAutentService} from '../servicio-de-autent.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {Injectable} from '@angular/core';
import {auth} from 'firebase';


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

  // PARA PODER ACCEDER A LOS MÉTODOS
  constructor(public authApp: ServicioDeAutentService, public miauth: AngularFireAuth, private db: AngularFireDatabase) {
  }

  // VARIABLE "OBSERVADOR" QUE RECOPILA INFO SOBRE EL ESTADO DEL USER (DEVUELVE: NULL = NO LOGEADO, OBJETO USER = LOGEADO)
  user = this.miauth.authState;

  ngOnInit() {

  }

  // función que usaremos en el evento "click" para asignar a la variable "selectedProducto" el producto seleccionado
  onSelect(producto: Productos, index): void {
    this.selectedProducto = producto;
    producto.comprado = true;
    this.productosSelecA.push(producto);
    this.productosA.splice(index, 1);

    // INCLUÍMOS LAS FUNCIONALIDADES BD EN ESTA FUNCIÓN (IMPORTAR LO NECESARIO)
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
