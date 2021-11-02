/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
   firebaseConfig : {
    apiKey: "AIzaSyB0mlFMYVm9lMSAPiORf1lii5mXRGXdTME",
    authDomain: "whatnowtravelapp.firebaseapp.com",
    projectId: "whatnowtravelapp",
    storageBucket: "whatnowtravelapp.appspot.com",
    messagingSenderId: "297732428043",
    appId: "1:297732428043:web:263e5a91017fbcb8d2120e",
    measurementId: "G-B215HGSD20"
  }
};
