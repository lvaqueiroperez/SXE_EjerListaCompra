import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ServicioDeAutentService {

  constructor(public miauth: AngularFireAuth) {
  }

  user = this.miauth.authState;

}
