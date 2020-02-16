import {Productos} from './productos';

export const PRODUCTOS_ARRAY: Productos[] = [
// da error porque no se ha puesto el atributo de "comprado", pero aún así lo muestra en la web, arreglar?
  {nombre: 'Patata', desc: 'Patatas para cocinar', comprado: false},
  {nombre: 'Huevos', desc: '12 huevos', comprado: false},
  {nombre: 'Sal', desc: 'Sal 100g', comprado: false},
  {nombre: 'Arroz', desc: 'Arrox 200g', comprado: false},
  {nombre: 'Azucar', desc: 'Azucar 100g', comprado: false},
  {nombre: 'Pan', desc: '2 barras de pan', comprado: false},

];
