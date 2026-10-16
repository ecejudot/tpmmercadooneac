import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { File } from 'expo-file-system';
import * as Network from 'expo-network';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { _getAllKeys, _remove, _retrieveData, _storeData } from '../js/localdata.js';
import grabarAlmacen from '../js/saveAlmacen.js';
import grabarMercado from '../js/saveMercado.js';
import grabarReportes from '../js/saveReportes.js';
import SincronizarAM from '../js/sincronizarAM.js';
//import sincronizarResultados from '../js/uploadResultados.js';
import callUploadFile from './../js/callUploadFile.js';
import getFecha from './../js/getFecha.js';

export default function screen01() {

  const router = useRouter();

  const [userCentro, setUserCentro] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('');
  const [userSysId, setUserSysId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [descCentro, setDescCentro] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([{ mensaje }]);
  const [fecha, setFecha] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadingFotos, setLoadingFotos] = useState(0);

  const { werks } = useLocalSearchParams();
  const { desc } = useLocalSearchParams();
  const { sysId } = useLocalSearchParams();
  const { lgort } = useLocalSearchParams();

  const navigation = useNavigation();
  const networkState = Network.useNetworkState();

  useEffect(() => {

    _retrieveData('@storage_key_tpm').then((val1) => {

      try {

        if (val1) {
          const val = JSON.parse(val1);

          setUserSysId(val[0].userSysId);
          setUserCentro(val[0].centroTPM);
          setUserAlmacen(val[0].userAlmacen);
          setUserEmail(val[0].userEmail);
          setUserCentro(val[0].descCentroTPM);

          navigation.setOptions({
            title: `${werks} ${desc} ( ${val[0].userEmail})`
          })

          refresh();

        }

      } catch {
        console.log("error val");
      }

    });

  }, []);

  const refresh = () => {

    setLoading(true);

    _getAllKeys().then((allkeys) => {
      setLoading(false);
    });

  }


  const sincronizarResultados = async () => {

    let continuar = true;

    setMensajes([]);

    mensajes.forEach(element => {
      mensajes.pop();
    });

    mensajes.pop();

    setMensajes(mensajes);


    mensajes.push({ mensaje: `Sincronizado ...` });
    setMensajes(mensajes);

    setLoading(true);

    setMensaje(`Sincronizando resultados, conexión de red: ${networkState.type}, obteniendo conexión con backend...`);

    mensajes.push({ mensaje: `Sincronizando resultados, conexión de red: ${networkState.type}, obteniendo conexión con backend...` });
    setMensajes(mensajes);

    await getFecha().then((fecha) => {
      setMensaje(`Sincronizando resultados, conexión de red: ${networkState.type} ... conectado ...`);

      mensajes.push({ mensaje: `... conectado ...` });
      setMensajes(mensajes);

    }, () => {
      setMensaje(`Error conexión Backend`);
      mensajes.push({ mensaje: `Error conexión Backend` });
      setMensajes(mensajes);

      setLoading(false);
      continuar = false;
    });

    if (!continuar) {

      setTimeout(() => {
        setMensajes([]);
      }, 9000);

      return;
    }


    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha1 = new Date().toLocaleDateString();

    await _getAllKeys().then((allkeys) => {

      setLoadingFotos(allkeys?.length || 0);

      let restar = true;
      let index = 0;

      console.table(allkeys);


      allkeys?.forEach(async (tsdm: string | string[]) => {

        index = + 1;

        if (tsdm.includes(`@foto_${sysId}_`)) {

          restar = false;

          await _retrieveData(tsdm).then(async (m) => {

            let fileb64 = '';

            if (Platform.OS === 'web') {
              fileb64 = m?.split(',')[1]; // Quito el encabezado data:image/jpeg;base64,
            } else {
              const file = new File(m);
              fileb64 = file.base64Sync()
            }


            await callUploadFile(fileb64, tsdm).then(() => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado foto ${tsdm.slice(0, 10)}`);
                mensajes.push({ mensaje: `sincronizado foto ${tsdm.slice(0, 10)}` });
                setMensajes(mensajes);

              } catch (error) {
                setMensaje('Error al sincronizar fotos');
                setLoading(false);
              } finally {
                setLoading(false);
                setLoadingFotos(loadingFotos - 1);
              }
            })

          })
        }

        if (tsdm.includes(`AID.${sysId}.`)) {

          restar = false;

          await _retrieveData(tsdm).then(async (m) => {

            await grabarAlmacen(m).then((resp) => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado almacén ${tsdm}`);
                mensajes.push({ mensaje: `sincronizado almacén ${tsdm}` });
                setMensajes(mensajes);
              } catch (error) {
                setMensaje('Error al sincronizar almacén');
                setLoading(false);
              } finally {
                setLoading(false);
                setLoadingFotos(loadingFotos - 1);
              }

            },
              () => {
                setMensaje('Error al sincronizar almacén');
                setLoading(false);
              }
            );

          }
          )
        }

        if (tsdm.includes(`MID.${sysId}.`)) {

          restar = false;

          await _retrieveData(tsdm).then(async (m) => {

            await grabarMercado(m).then((resp) => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado mercado ${tsdm}`);
                mensajes.push({ mensaje: `sincronizado mercado ${tsdm}` });
                setMensajes(mensajes);
              } catch (error) {
                setMensaje('Error al sincronizar mercado');
                setLoading(false);
              } finally {
                setLoading(false);
                setLoadingFotos(loadingFotos - 1);
              }

            },
              () => {
                setMensaje('Error al sincronizar mercado');
                setLoading(false);
              }
            );

          }
          )

        }

        if (tsdm.includes(`MIDREP.${sysId}.`)) {

          restar = false;

          await _retrieveData(tsdm).then(async (m) => {

            await grabarReportes(m).then((resp) => {
              try {
                _remove(tsdm);
                mensajes.push({ mensaje: `sincronizado reportes mercado ${tsdm}` });
                setMensajes(mensajes);
              } catch (error) {
                setMensaje('Error al sincronizar reporte mercado');
                setLoading(false);
              } finally {
                setLoading(false);
                setLoadingFotos(loadingFotos - 1);
              }

            },
              () => {
                setMensaje('Error al sincronizar reporte mercado');
                setLoading(false);
              }
            );

          }
          )

        }

        if (tsdm.includes(`AIDREP.${sysId}.`)) {

          restar = false;

          await _retrieveData(tsdm).then(async (m) => {

            await grabarReportes(m).then((resp) => {
              try {
                _remove(tsdm);
                mensajes.push({ mensaje: `sincronizado reportes almacén ${tsdm}` });
                setMensajes(mensajes);
              } catch (error) {
                setMensaje('Error al sincronizar reporte almacén');
                setLoading(false);
              } finally {
                setLoading(false);
                setLoadingFotos(loadingFotos - 1);
              }

            },
              () => {
                setMensaje('Error al sincronizar reporte almacén');
                setLoading(false);
              }
            );

          }
          )

        }

        if (restar) {
          setLoadingFotos(loadingFotos - 1);
        }

      }
      )

    });

    setLoadingFotos(0);
    setLoading(false);
    setMensaje('Datos enviados');
    mensajes.push({ mensaje: `Datos enviados ...`, });
    setMensajes(mensajes);

    setTimeout(() => {
      setMensajes([]);
    }, 9000);

  }

  const sincronizarAM = () => {

    setLoading(true);

    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha = new Date().toLocaleDateString();

    SincronizarAM().then((resp) => {

      try {

        let tpm001 = JSON.parse(resp);

        tpm001 = tpm001.tpm001;

        let allp: any[] = [];
        let alls: any[] = [];

        _getAllKeys().then((allkeys) => {

          allkeys?.forEach((tsdm: string | string[]) => {
            if (tsdm.includes(`@TPM.${userSysId}.`))
              allp.push(_remove(tsdm));
          })

        });


        /*         tpm001.map(async (i: any) => {
                  let tsdm = `@TPM.${userSysId}.${i.werks}.${i.ivnum}`;
                  allp.push(_remove(tsdm));
                }) */

        tpm001.map(async (i: any) => {
          let tsdm = `@TPM.${userSysId}.${i.werks}.${i.ivnum}`;
          alls.push(_storeData(tsdm, JSON.stringify(i)));
        })

        if (allp.length) {
          Promise.all(allp).then(() => {
            Promise.all(alls).then(() => {
              refresh();
              setLoading(false);
            })
          })
        }
        else {
          Promise.all(alls).then(() => {
            refresh();
            setLoading(false);
          })
        }

      } catch (error) {
        setLoading(false);
      } finally {

      }

    }, () => {
      setLoading(false);

    }
    )


  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>{fecha.toLocaleDateString()}</Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          alignContent: 'space-evenly',
          padding: 10,
        }}
      >

        <Pressable
          disabled={loading}
          style={styles.button2}
          onPress={() => {
            router.push({
              pathname: "./screen04",
              params: {
                werks: werks,
                desc: desc,
                sysId: sysId
              },
            }
            );
          }
          }
        >
          <Text style={styles.button}>Mercado</Text>
        </Pressable>

        <Pressable
          disabled={loading}
          style={styles.button2}
          onPress={() => {
            router.push({
              pathname: "./screen02",
              params: {
                werks: werks,
                lgort: lgort,
                desc: desc,
                sysId: sysId
              },
            }
            );
          }
          }
        >
          <Text style={styles.button}>Almacén</Text>
        </Pressable>

      </View>

      <View
        style={{
          flex: 1,
        }}
      >

        <Pressable
          disabled={loading}
          style={styles.button2}
          onPress={() => {
            //sincronizarAM();

            sincronizarResultados();
          }
          }
        >
          <Text style={styles.button}>Sincronizar SAP</Text>
        </Pressable>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {loadingFotos > 0 && (
          <>
            <ActivityIndicator size="large" color="#7c0c0a" />
            <Text style={styles.title}>Sincronizando</Text>
          </>
        )
        }

        <FlatList

          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            marginBottom: 50,

          }}
          data={mensajes}

          renderItem={

            ({ item }) => {

              return (

                <Pressable
                  onPress={() => {


                  }}
                >
                  <View style={{
                    margin: 5,
                    borderWidth: 0,
                    width: 300
                  }}>
                    <Text style={{ fontSize: 18 }}>{item.mensaje}</Text>
                  </View>
                </Pressable>
              )
            }

          }
          keyExtractor={(item, index) => String(index)}

        />

      </View>


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#f3ab8e75'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  button: {
    fontSize: 28,
    borderWidth: 0,
    padding: 20,
    backgroundColor: '#934633',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    //marginTop: 20,
    //width: '90%'
  },
  button2: {
    fontSize: 20,
    borderWidth: 0,
    padding: 2,
    backgroundColor: '#f3ab8e75',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    margin: 20,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
