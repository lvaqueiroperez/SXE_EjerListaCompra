import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {AngularFireDatabase, AngularFireDatabaseModule} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeAutentService {

  email = '';
  pass = '';
  authUser = null;

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

  // INSERTAR/ACTUALIZAR EN LA BD
  updateUserData(user: any) {
    console.log('user: ', user);
    // DONDE VAMOS A GUARDAR LOS USUARIOS
    const path = 'users/';
    const u = {
      emailU: user.email
    }

    // HACEMOS LA ACTUALIZACIÓN EN LA BD, SI NO EXISTE CREA EL CAMPO, PONEMOS CATCH PARA CAPTURAR ERRORES Y A
    // CONTINUACIÓN LO ENSEÑAMOS POR PANTALLA
    this.db.object(path).update(u).catch(error => console.log(error));

  }

}
