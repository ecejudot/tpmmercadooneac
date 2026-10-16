
import { _retrieveData } from '../js/localdata.js';

export default async function callSap(body, name) {

  let urlhost = 'http://10.17.78.74:5000/Home/api/MyFileUploadb64/?systemid=';
  //const urlhost = 'http://localhost:5167/Home/api/MyFileUpload/?systemid=' + sysId;
  //urlhost = 'http://localhost:5000/Home/api/MyFileUploadb64?systemid=';

  //console.log(urlhost);

  return new Promise((resolve, reject) => {
    try {

      var request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {

        if (request.readyState !== 4) {

          console.log(request.readyState);

        } else {

          //console.log(request.readyState);
          //console.log(request.status);
          //console.log(request.responseText);

          if (request.status === 200) {

            //console.log(request.status);

            console.log(request.responseText);

            resolve(request.responseText);

            //return request;

          }

        }

      }

      request.ontimeout = (e) => {
        // XMLHttpRequest timed out. Do something here.
        console.log("timeout");
        let mensaje = {};
        mensaje.mensaje = 'TimeOut';
        resolve(JSON.stringify(mensaje));
      };

      _retrieveData('@storage_key_tpm').then(value => {

        //console.log("login");
        //console.log(value);

        value = JSON.parse(value);
        let sysid = value[0].userSysId;
        let centro = value[0].userCentro;
        let usuario = value[0].userEmail;

        let INFO = value[0];
        INFO = INFO.info[0];

        urlhost = urlhost + sysid + centro + name + '.jpg';

        request.open('POST', urlhost, true);
        request.timeout = 60000;
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('mode', 'cors');
        request.send(JSON.stringify(body));

      })

    }


    catch (error) {
      console.error('error catch');
      console.error(error);
      reject(error);
    } finally {

    }

  }
  );
};

