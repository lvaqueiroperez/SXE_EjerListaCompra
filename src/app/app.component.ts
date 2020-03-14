import {Component} from '@angular/core';
import {ServicioDeAutentService} from './servicio-de-autent.service';
import {environment} from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.title;

  // PARA PODER USAR LA VARIABLE USER EN EL HTML:
  constructor(public authApp: ServicioDeAutentService) {
  }
}
