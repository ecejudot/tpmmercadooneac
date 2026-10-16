

import {
  Platform
} from 'react-native';

const objToString = (obj) => {
  return Object.entries(obj).reduce((str, [p, val]) => {
      return `${str}${p}::${val}\n`;
  }, '');
}

export default async function callSap(body, sysId, timedout = 60000) {

  let urlhost = 'http://10.17.78.74:5000/Home?systemid=' + sysId;

  //urlhost = 'http://10.18.100.129:5000/Home?systemid=' + sysId;

  //const urlhost = 'http://10.14.37.42:5000/Home?systemid=' + sysId;
  //urlhost = 'http://localhost:5000/Home?systemid=' + sysId;

  if (Platform.OS === 'web') {
  //  urlhost = 'http://localhost:5000/Home?systemid=' + sysId;
  }

  let mensaje = {};

  return new Promise((resolve, reject) => {
    try {

      var request = new XMLHttpRequest();

      request.onreadystatechange = (e) => {

        if (request.readyState !== 4) {

        } else {

          if (request.status === 200) {

            resolve(request.responseText);

          }

        }

      }

      request.ontimeout = (e) => {
        // XMLHttpRequest timed out. Do something here.
        mensaje = {};
        mensaje.mensaje = 'TimeOut';
        reject(mensaje);
      };

      request.onprogress = (e) => {
        // XMLHttpRequest timed out. Do something here.
        mensaje = {};
        mensaje.mensaje = '...';
      };

      request.onerror = (e) => {
        // XMLHttpRequest timed out. Do something here.
        //Alert.alert("callsap", objToString(e));
        //Alert.alert("callsap", objToString(request));
        mensaje = {};
        mensaje.mensaje = 'error';
        reject(mensaje)
      };

      request.open('POST', urlhost, true);
      request.timeout = timedout; // time in milliseconds
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('mode','cors');
      request.send(JSON.stringify(body));

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

