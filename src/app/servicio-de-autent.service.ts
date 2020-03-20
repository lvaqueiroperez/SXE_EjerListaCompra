import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database';
import {Productos} from './Clases/productos';
import {PRODUCTOS_ARRAY} from './Clases/productosArray';
import {PRODUCTOSSELEC_ARRAY} from './Clases/productosSelecArray';
import {ProductosComponent} from './productos/productos.component';

@Injectable({
  providedIn: 'root'
})
// OJO! FUNCIONALIDADES CON LA LISTA COMPRA IMPLEMENTADAS EN EL GOOGLE LOGIN
export class ServicioDeAutentService {

  email = '';
  pass = '';
  authUser = null;
  productosC: Productos[] = [];
  productosNoC: Productos[] = [];

  // IMPLEMENTAREMOS AQUÍ EL GUARDADO DE DATOS DEL USUARIO EN LA BD DE FIREBASE,
  // AÑADIMOS VARIABLES QUE NOS HAGAN FALTA EN EL CONSTRUCTOR
  // (PARA QUE FUNCIONASE "prod", PONER UN PROVIDER?? EN APP.MODULE.TS)
  constructor(public miauth: AngularFireAuth, private db: AngularFireDatabase, public prod: ProductosComponent) {
  }

  // VARIABLE "OBSERVADOR" QUE RECOPILA INFO SOBRE EL ESTADO DEL USER (DEVUELVE: NULL = NO LOGEADO, OBJETO USER = LOGEADO)
  user = this.miauth.authState;


  login() {
    this.miauth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        this.authUser = user.user;
        console.log('this.authUser: ', this.authUser);

        // IMPLEMENTAMOS LA BD EN EL LOGIN:
        this.updateUserData(user.user);

      })
      .catch(error => console.log(error));
  }

  glogin() {
    this.miauth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        this.authUser = user.user;
        console.log('this.authUser: ', this.authUser);
        // IMPLEMENTAMOS LA BD EN EL LOGIN:
        this.updateUserData(user.user);
        // RELLENAMOS PRODUCTOS NO COMPRADOS:
        this.updateUserDataProductosNoCInicio();
        // ACCEDEMOS AL MÉTODO PARA OBTENER LOS PRODUCTOS CON EL MISMO USER
        this.obtenerProductos(user.user);
      })
      .catch(error => console.log(error));
  }

  gitHubLogin() {

    console.log('github login!');
    this.miauth.auth.signInWithPopup(new auth.GithubAuthProvider())
      .then(user => {
        console.log('user logado: ', user);
        this.authUser = user.user;

        // IMPLEMENTAMOS LA BD EN EL LOGIN:
        this.updateUserData(user.user);

      })
      .catch(error => {
        console.log('error en google login: ', error);
      });

  }

  logout() {
    console.log('logout!');
    this.miauth.auth.signOut();
  }

  // INSERTAR/ACTUALIZAR EN LA BD EL USER
  updateUserData(user: any) {
    console.log('user: ', user);
    // DONDE VAMOS A GUARDAR LOS USUARIOS: (SEPARAMOS MAIL DE PRODUCTOS)
    const path = 'users/' + user.uid;
    const u = {
      emailU: user.email
    };


    // HACEMOS LA ACTUALIZACIÓN EN LA BD, SI NO EXISTE CREA EL CAMPO, PONEMOS CATCH PARA CAPTURAR ERRORES Y A
    // CONTINUACIÓN LO ENSEÑAMOS POR PANTALLA
    this.db.object(path).update(u).catch(error => console.log(error));

  }

  obtenerProductos(user: any) {
    // RELLENAMOS EL ARRAY DE PRODUCTOS NO COMPRADOS
    this.retornarProductosNoC(user).subscribe(snap => {
      // BORRAMOS ARRAYS LOCALES POR SI ACASO PONIENDO ESTO:
      this.productosNoC = [];
      snap.forEach(u => {

        const producto: any = u.payload.val();
        this.productosNoC.push(producto);
      });
    });

    // RELLENAMOS EL ARRAY DE PRODUCTOS CCOMPRADOS
    this.retornarProductosC(user).subscribe(snap => {
      this.productosC = [];
      snap.forEach(u => {

        const producto: any = u.payload.val();
        this.productosC.push(producto);
      });
    });
    // COMPROBAMOS CON UN LOG
    console.log('productosC: ' + this.productosC);
    console.log('productosNoC: ' + this.productosNoC);
    // TENDREMOS QUE PONER SIEMRPE EN LA BD LOS DATOS DEL ARRAY NO COMPRADOS POR SI ACASO, SIN BORRAR LOS COMPRADOS,
    // Y LUEGO MACHACARLOS CON LOS COMPRADOS
    // RECORREMOS LOS ARRAYS Y ACTUALIZAMOS LA BD Y LOS ARRAYS DEL HTML
    // PRIMERO LOS NO COMPRADOS:
    console.log('actualizando la bd');
    for (const producto of this.productosNoC) {
      const path = 'users/' + this.miauth.auth.currentUser.uid + '/productosC/' + producto.nombre;
      this.db.object(path).remove();
      const path2 = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC';
      const nombreP = producto.nombre;
      const u = {
        [nombreP]: producto
      };

      this.db.object(path2).update(u).catch(error => console.log(error));
    }
    // AHORA LOS COMPRADOS:
    for (const producto of this.productosC) {
      console.log('actualizando en la bd');
      const path = 'users/' + this.miauth.auth.currentUser.uid + '/productosC';
      const nombreP = producto.nombre;
      const u = {
        [nombreP]: producto
      };

      this.db.object(path).update(u).catch(error => console.log(error));
      // BORRAMOS DE LOS NO COMPRADOS
      const path2 = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC' + producto.nombre;
      this.db.object(path2).remove();
    }

    // AHORA LOS ARRAYS HTML(los vaciamos y ponemos en ellos el contenido de las BD)
    // (no deja vaciarlo de la otra manera ????)
    // EL NAVEGADOR SE BLOQUEA ??? FALTA ACTUALIZAR LA LISTA HTML CADA VEZ QUE SE LOGUEA UN USER DIFERENTE
    // PARECE QUE NO FUNCIONAN LOS PUSH DESDE ESTA CLASE, ACCEDEMOS A LOS MÉTODOS DE "PRODUCTOS.COMPONENT.TS"
    /*
    console.log('METER ARRAY: ' + this.productosNoC);
    console.log('METER ARRAY: ' + this.productosC);
    PRODUCTOS_ARRAY.length = 0;
    PRODUCTOSSELEC_ARRAY.length = 0;

    for (const producto of this.productosNoC) {
      // OBTENEMOS EL INDEX
      const index: number = this.productosNoC.indexOf(producto);
      // LLAMAMOS A LA FUNCIÓN:
      this.prod.onSelect2(producto, index);
    }
    for (const producto of this.productosC) {
      // OBTENEMOS EL INDEX
      const index: number = this.productosC.indexOf(producto);
      // LLAMAMOS A LA FUNCIÓN:
      this.prod.onSelect(producto, index);
    }
   */
  }

  retornarProductosNoC(user: any) {

    // OBTEBNEMOS DE LA BD TODOS LOS PRODUCTOS QUE HAYA COMPRADOS O SIN COMPRAR Y LOS MANDAMOS A LOS ARRAYS
    const path2 = 'users/' + user.uid + '/productosNoC';
    return this.db.list(path2).snapshotChanges();
  }

  retornarProductosC(user: any) {
    const path1 = 'users/' + user.uid + '/productosC';

    // OBTEBNEMOS DE LA BD TODOS LOS PRODUCTOS QUE HAYA COMPRADOS O SIN COMPRAR Y LOS MANDAMOS A LOS ARRAYS
    return this.db.list(path1).snapshotChanges();
  }

  // INSERTAR PRODUCTOS COMPRADOS EN LA BD, RECIBE COMO PARÁMETRO EL PRODUCTO SELECCIONADO
  updateUserDataComprados(producto: Productos) {
    console.log('actualizando en la bd');
    // OJO A COMO OBTENEMOS EL ID DEL USUARIO ACTUAL
    const path = 'users/' + this.miauth.auth.currentUser.uid + '/productosC';
    // PARA PODER USAR UNA VARIABLE COMO KEY:
    const nombreP = producto.nombre;
    const u = {
      [nombreP]: producto
    };

    this.db.object(path).update(u).catch(error => console.log(error));
    // BORRAMOS DE LOS NO COMPRADOS
    const path2 = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC/' + producto.nombre;
    this.db.object(path2).remove();


  }

  // AHORA PARA LOS PRODUCTOS QUE HEMOS QUITADO DE "COMPRADOS"
  updateUserDataProductosNoC(producto: Productos) {
    console.log('actualizando la bd');
    const path = 'users/' + this.miauth.auth.currentUser.uid + '/productosC/' + producto.nombre;
    this.db.object(path).remove();
    const path2 = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC';
    const nombreP = producto.nombre;
    const u = {
      [nombreP]: producto
    };

    this.db.object(path2).update(u).catch(error => console.log(error));
  }

  // MÉTODO QUE SE EJECUTARÁ EN CADA LOGEO Y QUE NO BORRA LOS COMPRADOS:
  updateUserDataProductosNoCInicio() {
    this.productosNoC = PRODUCTOS_ARRAY;
    const path = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC';
    // RECORREMOS EL ARRAY Y ACTUALIZAMOS LA BD
    for (const producto of this.productosNoC) {
      console.log(producto);
      const u = {
        [producto.nombre]: producto
      };
      this.db.object(path).update(u).catch(error => console.log(error));
    }

  }

  // PARA DEVOLVER TODOS LOS USERS
  getUsers() {
    const path = 'users/';
    // return this.db.list(path).valueChanges();
    // RETORNAMOS LOS OBJETOS USER EN UNA LISTA
    return this.db.list(path).snapshotChanges();

  }

  // PARA BORRAR USERS
  removeUser(userUid) {
    const path = 'users/' + userUid;
    return this.db.object(path).remove();

  }

}
