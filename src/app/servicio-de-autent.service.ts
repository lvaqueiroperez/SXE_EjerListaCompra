import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database';
import {Productos} from './Clases/productos';
import {PRODUCTOS_ARRAY} from './Clases/productosArray';
import {PRODUCTOSSELEC_ARRAY} from './Clases/productosSelecArray';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeAutentService {

  email = '';
  pass = '';
  authUser = null;
  productosC: Productos[];
  productosNoC: Productos[];

  // IMPLEMENTAREMOS AQUÍ EL GUARDADO DE DATOS DEL USUARIO EN LA BD DE FIREBASE
  constructor(public miauth: AngularFireAuth, private db: AngularFireDatabase) {
  }

  // VARIABLE "OBSERVADOR" QUE RECOPILA INFO SOBRE EL ESTADO DEL USER (DEVUELVE: NULL = NO LOGEADO, OBJETO USER = LOGEADO)
  user = this.miauth.authState;

  // PONER DENTRO DE ESTOS MÉTODOS EL ACCESO A LA DB? O PONERLOS EN SU PROPIO FICHERO???
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
        // ACCEDEMOS AL MÉTODO DE LOS ARRAYS CON EL MISMO USER
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
    // UNA VEZ CONECTADO, OBTENEMOS DE LA BD LOS PRODUCTOS QUE TIENE COMPRADOS O NO COMPRADOS (poner aquí la función !!!)

  }

  obtenerProductos(user: any) {
    // RELLENAMOS EL ARRAY DE PRODUCTOS NO C
    this.retornarProductosNoC(user).subscribe(snap => {
      this.productosNoC = [];
      snap.forEach(p => {

        const producto: any = p.payload.val();
        this.productosNoC.push(producto);
      });
    });

    // RELLENAMOS EL ARRAY DE PRODUCTOS C
    this.retornarProductosC(user).subscribe(snap => {
      this.productosC = [];
      snap.forEach(p2 => {

        const producto2: any = p2.payload.val();
        this.productosC.push(producto2);
      });
    });

    // COMPROBAMOS CON UN LOG
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

  // INSERTAR PRODUCTOS COMPRADOS EN LA BD, RECIBE COMO PARÁMETRO EL PRODUCTO SELECCIONADO (EL USER LO OBTENEMOS DESDE AQUÍ)
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
    const path2 = 'users/' + this.miauth.auth.currentUser.uid + '/productosNoC' + producto.nombre;
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
