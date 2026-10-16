

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import getFecha from '../../js/getFecha.js';
import { _getAllKeys, _remove, _retrieveData, _storeData } from '../../js/localdata.js';
import SincronizarAM from '../../js/sincronizarAM.js';


export default function Page() {

  const audioSource = require('../../assets/sounds/welcome.mp3');
  const player = useAudioPlayer(audioSource);

  const [version, setVersion] = useState('260207');
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [cb, setCb] = useState('');
  const [cb2, setCb2] = useState('');
  const [userCentro, setUserCentro] = useState('9999');
  const [userAlmacen, setUserAlmacen] = useState('0000');
  const [userSysId, setUserSysId] = useState('S4P');
  const [userPassword, setUserPassword] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('Bienvenidos');
  const [ip, setIp] = useState('');
  const [timeout, setTimeout] = useState({});
  const [isLoading, setLoading] = useState(false);

  const [value, setValue] = useState();
  const refInputPass = useRef<TextInput>(null);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [location, setLocation] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [edit, setEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [claves, setClaves] = useState<any>([]);
  const [fecha, setFecha] = useState('');

  const [usuarios, setUsuarios] = useState<any>([]);
  const [centros, setCentros] = useState<any>([]);
  const [centrosUsuario, setCentrosUsuario] = useState<any>([]);
  const [mensajes, setMensajes] = useState([{ mensaje }]);
  const isFocused = useIsFocused();

  let currentDate = new Date();

  const networkState = Network.useNetworkState();

  // Define the type for each item in the list
  interface Item {
    lgort?: string;
    werks: string;
    desc: string;
    am: string;
  }

  useEffect(() => {

    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        //setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location1 = await Location.getCurrentPositionAsync({});
        setLocation(location1.coords);
      } catch (error) {
        setLoading(false);
      }

      setLoading(false);
    })();

    (async () => {

      try {
        await Network.getIpAddressAsync().then((ip) => {
          //console.log(ip);
          setIp(ip);
        });
      } catch (error) {
        console.log('error get ip');
      }


    })();

    debugger;

    _retrieveData('@storage_key_tpm')

      .then(val1 => {

        debugger;

        try {

          if (val1) {
            const val = JSON.parse(val1);

            setUserSysId(val[0].userSysId);
            setUserCentro(val[0].userCentro);
            setUserAlmacen(val[0].userAlmacen);
            setUserEmail(val[0].userEmail);

            let tsdm = `@fecha${val[0].userSysId}${val[0].userCentro}${val[0].userAlmacen}`;

            _retrieveData(tsdm).then(val1 => {

              try {

                if (val1) {
                  setFecha(val1);
                } else {
                  setFecha('');
                }

              } catch {
                console.log("error get fecha");
              }
            });


            let dmkey = `@storage_dm${val[0].userSysId}${val[0].userCentro}${val[0].userAlmacen}`;

            _retrieveData(dmkey).then(val1 => {

              try {

                if (val1) {
                  let val2 = JSON.parse(val1);
                  if (val2) {
                    setUsuarios(val2.users);
                    setCentros(val2.centros);
                  }
                }

              } catch {
                console.log("error get fecha");
              }
            });

          }

        } catch {
          console.log("error val");
        }

        _getAllKeys().then(val1 => {
          if (val1) {
            setClaves(val1);
          }

        })

      }, val2 => {


        const loginfo = [
          {
            userSysId: userSysId,
            userCentro: userCentro,
            userEmail: userEmail,
            userAlmacen: userAlmacen,
            version: version,
            ip: ip,
            device: Device,
            info: ''
          }];

        _storeData('@storage_key_tpm', JSON.stringify(loginfo));
        
      });

  }, [isFocused]);

  const renderItem = (item: { werks: string, desc: string }) => (

    <View style={{}}>
      <Text style={{}}>{item.werks} {item.desc}</Text>
    </View>
  );

  const refresh = async () => {

    setCentrosUsuario([]);

    await _getAllKeys().then((keys) => {

      let newCU = centrosUsuario.map((item: any) => {

        let i = item;

        i.am = 0;

        keys?.forEach((key) => {
          if (key?.includes('@TPM.')) {
            let keyp = key.toString().split('.');
            if (keyp[1] === userSysId) {
              if (i.werks === keyp[2]) {
                i.am = Number(i.am) + 1;
              }
            }
          }
        })

        return i;

      })

      setCentrosUsuario(newCU);

    })

  }

  const sincronizarAM = async () => {

    setLoading(true);

    let continuar = true;

    setMensajes([]);

    setLoading(true);

    setMensaje(`Sincronizando resultados, conexión de red: ${networkState.type}, obteniendo conexión con backend...`);

    await getFecha().then((fecha: any) => {
      console.log(fecha);
      setMensaje(`Sincronizando resultados, conexión de red: ${networkState.type} ... conectado ...`);
    }, () => {
      setMensaje(`Error conexión Backend`);
      setLoading(false);
      continuar = false;
    });

    if (!continuar) {

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      )

      return;
    }

    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha = new Date().toLocaleDateString();

    const userWithId2 = usuarios.find((user: { bname: string; }) => user.bname === userEmail);
    setCentrosUsuario([]);
    let cens = [];

    if (userWithId2.werks1) {

      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks1);
      let w = { 'werks': userWithId2.werks1, 'desc': fcentro.name1, 'am': '0' };
      cens.push(w);
      setCentrosUsuario(cens);
    }

    if (userWithId2.werks2) {

      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks2);
      let w = { 'werks': userWithId2.werks2, 'desc': fcentro.name1, 'am': '0' };
      cens.push(w);
      setCentrosUsuario(cens);
    }

    if (userWithId2.werks3) {

      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks3);
      let w = { 'werks': userWithId2.werks3, 'desc': fcentro.name1, 'am': '0' };
      cens.push(w);
      setCentrosUsuario(cens);
    }

    if (userWithId2.werks4) {

      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks4);
      let w = { 'werks': userWithId2.werks4, 'desc': fcentro.name1, 'am': '0' };
      cens.push(w);
      setCentrosUsuario(cens);
    }

    if (userWithId2.werks5) {

      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks5);
      let w = { 'werks': userWithId2.werks5, 'desc': fcentro.name1, 'am': '0' };
      cens.push(w);
      setCentrosUsuario(cens);
    }


    await _getAllKeys().then((allkeys) => {

      allkeys?.forEach(async (tsdm: string | string[]) => {

        console.log(tsdm);
        if (tsdm.includes(`@TPM.${userSysId}.`)) {
          await _remove(tsdm);
        }

      }
      )
    }
    )

    await SincronizarAM().then((resp) => {

      try {

        let tpm001 = JSON.parse(resp);

        tpm001 = tpm001.tpm001;

        if (tpm001) {
          let allp: any[] = [];
          let alls: any[] = [];

          tpm001.map(async (i: any) => {
            let tsdm = `@TPM.${userSysId}.${i.werks}.${i.ivnum}`;
            alls.push(_storeData(tsdm, JSON.stringify(i)));
          })

          Promise.allSettled(alls).then(() => {
            refresh();
          })
        } else {
          setMensaje(`Sin auditorias`);
        }

      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }

    }, () => {
      setLoading(false);

    }
    )


  };

  return (

    <View style={styles.container}>

      <View style={styles.main}>

        <Stack.Screen options={{
          title: `TPM ${version}`,
          headerStyle: { backgroundColor: "#934633" },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => {
            return (
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  //BackHandler.exitApp();
                  //setEdit(true);
                  //setModalVisible(true);
                }}>
                <MaterialCommunityIcons name="account-cog" color='#FFF' size={24} />
              </TouchableOpacity>

            )
          },
          headerRight: () => {
            return (
              <TouchableOpacity onPress={() => {

                let keys = [];
                for (var i in claves) {
                  keys.push(claves[i].clave);
                  keys.push(claves[i]);
                }

                //_removeFew(keys);

                BackHandler.exitApp();

              }}>
                <MaterialCommunityIcons name="logout" color='#FFF' size={24} />
              </TouchableOpacity>

            )
          }
        }} />

        <View style={{
          alignItems: 'center',
        }}>

          <Image
            style={styles.logo}
            source={require('../../assets/images/logo.png')}
            resizeMode="contain"
          />

          <View style={{
            flexDirection: 'row',
          }}>
            <TextInput
              style={{
                width: 85,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: 'gray',
              }}

              onChangeText={(userSysIdV) => {

                setUserSysId(userSysIdV);
              }

              }

              placeholder='Sistema'

              value={userSysId}

              returnKeyType="next"

              editable={edit}

            />


            <TextInput
              style={{
                width: 85,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: 'gray',
              }}

              onChangeText={(c1) =>
                setUserCentro(c1)
              }

              placeholder='Centro'
              value={userCentro}
              keyboardType="numeric"
              returnKeyType="next"
              editable={edit}

            />

            <TextInput
              style={{
                width: 85,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: 'gray',
              }}

              onChangeText={(txtAlmacen) =>
                setUserAlmacen(txtAlmacen)
              }

              placeholder='Almacen'
              value={userAlmacen}
              keyboardType="numeric"
              returnKeyType="next"
              editable={edit}

            />

          </View>

          <TextInput
            style={{
              width: 255,
              borderColor: 'gray',
              borderWidth: 3,
              margin: 5,
              paddingHorizontal: 15,
              fontSize: 20,
              borderRadius: 25,
              backgroundColor: '#ffffff',
            }}

            onChangeText={(val) => {
              setUserEmail(val);
              console.log(userEmail);
            }
            }

            placeholder='Usuario'

            cursorColor='yellow'
            returnKeyType="next"
            value={userEmail}

          />
          <TextInput
            style={{
              width: 255,
              borderColor: 'gray',
              borderWidth: 3,
              margin: 5,
              paddingHorizontal: 15,
              fontSize: 20,
              borderRadius: 25,
              backgroundColor: '#ffffff',
            }}
            onChangeText={(userPassword) =>
              setUserPassword(userPassword)
            }

            placeholder='Password'
            keyboardType="numeric"
            secureTextEntry={true}
            ref={refInputPass}
            value={userPassword}
          />

          <TouchableOpacity
            style={styles.button}

            onPress={async () => {

              (async () => {

                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  //setErrorMsg('Permission to access location was denied');
                  return;
                }


                try {
                  let location1 = await Location.getCurrentPositionAsync({});
                  setLocation(location1.coords);
                } catch (error) {
                  setLoading(false);
                }


              })();

              /*               _getAllKeys().then(value => {
                              if (value && Array.isArray(value)) {
                                for (let val of value) {
                                  if (val != '@storage_key_tpm') {
                                    let clave: any = {};
                                    clave.clave = val;
                                    claves.push(clave);
                                  }
                                }
                                console.log(claves);
                              }
                            });
               */
              setMensaje('');

              if (!userSysId) {
                alert('Ingrese sistema');
                return;
              }

              if (!userCentro) {
                alert('Ingrese centro');
                return;
              }

              if (!userAlmacen) {
                alert('Ingrese almacén');
                return;
              }

              if (!userEmail) {
                alert('Ingrese usuario');
                return;
              }

              if (!userPassword) {
                alert('Ingrese password');
                if (refInputPass.current) {
                  refInputPass.current.focus();
                }
                return;
              }

              if (!fecha) {
                alert('Sincronizar DM');
                return;
              }

              setLoading(true);

              const loginfo = [
                {
                  userSysId: userSysId,
                  userCentro: userCentro,
                  userEmail: userEmail,
                  userAlmacen: userAlmacen,
                  version: version,
                  ip: ip,
                  device: Device,
                  info: '',
                  centroTPM: ''
                }];


              _storeData('@storage_key_tpm', JSON.stringify(loginfo));

              if (usuarios) {
                const userWithId2 = usuarios.find((user: { bname: string; }) => user.bname === userEmail);

                if (userWithId2) {
                  if (userWithId2.pass === userPassword) {

                    setCentrosUsuario([]);
                    let cens = [];

                    if (userWithId2.werks1) {

                      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks1);
                      let w = { 'werks': userWithId2.werks1, 'desc': fcentro.name1, 'am': '0' };
                      cens.push(w);
                      setCentrosUsuario(cens);
                    }

                    if (userWithId2.werks2) {

                      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks2);
                      let w = { 'werks': userWithId2.werks2, 'desc': fcentro.name1, 'am': '0' };
                      cens.push(w);
                      setCentrosUsuario(cens);
                    }

                    if (userWithId2.werks3) {

                      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks3);
                      let w = { 'werks': userWithId2.werks3, 'desc': fcentro.name1, 'am': '0' };
                      cens.push(w);
                      setCentrosUsuario(cens);
                    }

                    if (userWithId2.werks4) {

                      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks4);
                      let w = { 'werks': userWithId2.werks4, 'desc': fcentro.name1, 'am': '0' };
                      cens.push(w);
                      setCentrosUsuario(cens);
                    }

                    if (userWithId2.werks5) {

                      let fcentro = centros.find((centro: { werks: string; }) => centro.werks === userWithId2.werks5);
                      let w = { 'werks': userWithId2.werks5, 'desc': fcentro.name1, 'am': '0' };
                      cens.push(w);
                      setCentrosUsuario(cens);
                    }

                    //refresh();

                    player.seekTo(0);
                    player.play();

                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    )

                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

                    setMensaje('Bienvenido');
                    setUserPassword('');
                    setModalVisible(true);
                  } else {
                    setMensaje('Error en contraseña');
                  }
                }

                else {
                  setMensaje('Usuario no existe')
                }
              }
              else {
                setMensaje('Sincronize DM')
              }

              setLoading(false);

            }}

          >
            <Text style={{
              color: '#FFF',
              fontSize: 20,
              fontWeight: '700',
            }}>Ingresar</Text>
          </TouchableOpacity>

          <View style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}>
            {isLoading ? (
              <ActivityIndicator size='large' />
            ) : (

              <Text style={{
                alignItems: 'center',
                justifyContent: 'center',
                //backgroundColor: '#ffffff',
                fontSize: 20,
              }}>
                {mensaje}</Text>

            )}

            <Text style={{
              alignItems: 'center',
              justifyContent: 'center',
              //backgroundColor: '#ffffff',
              fontSize: 20,
              padding: 10,
            }}>{currentDate.toLocaleDateString('es-MX', {
              dateStyle: 'full',
              //timeZone: 'America/Tijuana'
            })}</Text>

            <Pressable
              onLongPress={() => {
                _getAllKeys().then((keys) => {
                  keys?.forEach((key) => {
                    console.log(key);
                    /*                     if (key.includes('AID')) {
                                          _remove(key);
                                        }          
                                        if (key.includes('MID')) {
                                          _remove(key);
                                        }    */
                    if (key.includes('@fecha')) {
                      _remove(key);
                    }
                    if (key.includes('@TPM')) {
                      _remove(key);
                    }
                    if (key.includes('@storage_dm')) {
                      _remove(key);
                    }
                  })

                })
              }}
              onPress={() => {
                _getAllKeys().then((keys) => {
                  keys?.forEach((key) => {
                    console.log(key);
                  })

                })
              }}
            >
              <Text style={{
                alignItems: 'center',
                justifyContent: 'center',
                //backgroundColor: '#ffffff',
                fontSize: 20,
                padding: 10,
              }}>DM: {fecha}</Text>
            </Pressable>
          </View>

        </View>
      </View>

      <Modal

        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onShow={() => { refresh() }}
        onRequestClose={() => {

          setModalVisible(false);
          setEdit(false);
        }}>

        <View style={{
          marginVertical: 50,
          padding: 15,
          backgroundColor: '#f3ab8e75',
          borderWidth: 1,
          borderRadius: 10,
          flex: 1,
        }}>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <View style={{
            backgroundColor: 'DarkRed',
            elevation: 2,
            margin: 10,
          }}>

            <Text style={styles.subtitle}>{mensaje}</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'DarkRed',
                padding: 10,
                borderBottomWidth: 5
              }}
            >

              <TouchableOpacity
                style={{
                  backgroundColor: '#934633',
                  padding: 5
                }}


                onPress={() => {
                  setMensaje('Bienvenidos');
                  setModalVisible(false);
                  setEdit(false);
                }}>
                <MaterialCommunityIcons name="close" color='#FFF' size={24} />
              </TouchableOpacity>

              <Text style={{
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}>Sincronizar 👉</Text>


              <TouchableOpacity
                style={{
                  backgroundColor: '#e9441bff',
                  padding: 5
                }}


                onPress={() => {
                  sincronizarAM();
                  //setModalVisible(false);
                  //setEdit(false);
                }}>
                <MaterialCommunityIcons name="refresh" color='#FFF' size={24} />
              </TouchableOpacity>

            </View>

            <FlatList
              data={centrosUsuario}
              ListHeaderComponent={
                <Text style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}>Seleccione centro:</Text>


              }
              renderItem={

                ({ item }: { item: Item }) => {

                  return (

                    <Pressable
                      onPress={() => {

                        //setModalVisible(false);

                        const loginfo = [
                          {
                            userSysId: userSysId,
                            userCentro: userCentro,
                            userEmail: userEmail,
                            userAlmacen: userAlmacen,
                            version: version,
                            ip: ip,
                            device: Device,
                            info: '',
                            centroTPM: item.werks,
                            descCentroTPM: item.desc,
                          }];


                        _storeData('@storage_key_tpm', JSON.stringify(loginfo));

                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

                        if (Platform.OS === 'web') {
                          setModalVisible(false);
                        }
                        router.push({
                          pathname: "./screen01",
                          params: {
                            werks: item.werks,
                            lgort: userAlmacen,
                            desc: item.desc,
                            sysId: userSysId
                          },
                        }
                        );
                      }
                      }
                    >
                      <View style={{
                        margin: 5,
                        borderWidth: 0,
                      }}>
                        <Text style={styles.subtitle}>{item.werks} {item.desc}</Text>
                        <Text style={styles.subtitle}>Aud.Mercado: {item.am}</Text>
                      </View>
                    </Pressable>
                  )
                }

              }
              keyExtractor={(item) => item.werks}
            />

          </View>
        </View>

      </Modal >

    </View >

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#f3ab8e75',
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'space-around',
    padding: 5,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#f9f9faff",
    backgroundColor: '#934633',
    padding: 5,
  },
  twocols: {
    flexDirection: 'row',
    alignContent: 'space-between',
    //alignItems: 'center'
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 300,
    margin: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#e1244a',
    padding: 10,
    borderRadius: 25,
    paddingHorizontal: 90,
    paddingVertical: 10,
    marginTop: 5,
  },
  buttonM: {
    alignItems: 'center',
    backgroundColor: '#e1244a',
    padding: 5,
    borderRadius: 25,
    paddingVertical: 5,
    marginTop: 5,
  },
});
