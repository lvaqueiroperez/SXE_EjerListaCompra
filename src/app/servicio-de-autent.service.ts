import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeAutentService {

  email = '';
  pass = '';
  authUser = null;

  constructor(public miauth: AngularFireAuth) {
  }

  // VARIABLE "OBSERVADOR" QUE RECOPILA INFO SOBRE EL ESTADO DEL USER (DEVUELVE: NULL = NO LOGEADO, OBJETO USER = LOGEADO)
  user = this.miauth.authState;

  login() {
    this.miauth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        this.authUser = user.user;
        console.log('this.authUser: ', this.authUser);
      })
      .catch(error => console.log(error));
  }

  glogin() {
    this.miauth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(user => {
        this.authUser = user.user;
        console.log('this.authUser: ', this.authUser);
      })
      .catch(error => console.log(error));
  }

  gitHubLogin() {

    console.log('github login!');
    this.miauth.auth.signInWithPopup(new auth.GithubAuthProvider())
      .then(user => {
        console.log('user logado: ', user);
        this.authUser = user.user;
      })
      .catch(error => {
        console.log('error en google login: ', error);
      });

  }

  logout() {
    console.log('logout!');
    this.miauth.auth.signOut();
  }

}
