

import callSap from "./callsap";

export default async function SincronizarDM(sysid, centro, almacen) {

  return new Promise(async (resolve, reject) => {

        let body = [];
        let lin = {};

        lin.almacen = almacen;
        lin.stock = '';

        body.push(lin);

        body = JSON.stringify(body);

        body = '(' + centro + '-LEER-TPM_DM)' + body;

        callSap(body, sysid).then((r1) => {
          resolve(r1);
        }, (r2) => {
          reject(r2);
        })
      });


  }
