// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {config} from 'rxjs';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyB0ajKM0zM_dQLXwDuP1jyKszXP_sPizVM',
    authDomain: 'listacompra-aa800.firebaseapp.com',
    databaseURL: 'https://listacompra-aa800.firebaseio.com',
    projectId: 'listacompra-aa800',
    storageBucket: 'listacompra-aa800.appspot.com',
    messagingSenderId: '1041483136323',
    appId: '1:1041483136323:web:1ea205576787148ab443f6',
    measurementId: 'G-VVH0RPV20E'
  },

  title: 'Angular + Firebase'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
