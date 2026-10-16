
import { _retrieveData } from '../js/localdata.js';

import callSap from "./callsap";

export default async function grabarMercado(dat) {

  return new Promise(async (resolve, reject) => {

    await _retrieveData('@storage_key_tpm').then(value => {

      if (value) {

        value = JSON.parse(value);
        let sysid = value[0].userSysId;
        let centro = value[0].userCentro;
        let usuario = value[0].userEmail;
        let almacen = value[0].userAlmacen;
        let INFO = value[0];
        //INFO = INFO.info[0];

        dat = JSON.parse(dat);
        
        let body = [];
        let lin = {...INFO, ...dat};

        lin.almacen = almacen;
        lin.stock = '';

        body.push(lin);

        body = JSON.stringify(body);

        body = '(' + centro + '-GRABAR-REPALM_TPM3)' + body;

        callSap(body, sysid).then((r1) => {
          resolve(r1);
        }, (r2) => {
          reject(r2);
        })
      } else {
        alert('Sin conexión a sap');
        reject('Sin conexión a sap');
      }


    });


  })
}


