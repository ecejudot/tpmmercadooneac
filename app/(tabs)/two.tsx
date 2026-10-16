
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { _retrieveData, _storeData } from '../../js/localdata.js';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import * as Network from 'expo-network';

import SincronizarDM from '../../js/sincronizardm.js';



export default function TabTwoScreen() {


  const [modalVisible, setModalVisible] = useState(true);
  const [edit, setEdit] = useState(false);
  const [clave, setClave] = useState('');
  const [userSysId, setUserSysId] = useState('S4P');
  const [userCentro, setUserCentro] = useState('9999');
  const [userEmail, setUserEmail] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('9999');
  const [version, setVersion] = useState('');
  const [ip, setIp] = useState('');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {



    (async () => {

      try {
        await Network.getIpAddressAsync().then((ip) => {
          console.log(ip);
          setIp(ip);
        });
      } catch (error) {
        console.log('error get ip');
      }


    })();

    refresh();


  }, []);

  const refresh = () => {

    _retrieveData('@storage_key_tpm').then(val1 => {

      try {

        setLoading(true);
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

          setLoading(false);

        }

      } catch {
        setLoading(false);
        console.log("error val");
      }
    });

  }

  const sincronizarDM = () => {

    setLoading(true);

    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha = new Date().toLocaleDateString();

    SincronizarDM(userSysId, userCentro, userAlmacen).then((resp) => {

      try {
        _storeData(dmkey, resp);
        _storeData(tsdm, fecha);
        refresh();

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
    <View style={{
      margin: 5,
      padding: 5,
      borderWidth: 0,
      backgroundColor: '#f3ab8e75',
      marginTop: 50,
    }}>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={{
        backgroundColor: 'DarkRed',
        //width: '50%',
        //height: '50%',
        elevation: 2,
        margin: 10,
      }}>


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
              setEdit(false);
              sincronizarDM();
            }}>
            <MaterialCommunityIcons name="file-sync" color='#FFF' size={24} />
          </TouchableOpacity>

          {edit &&
            <TouchableOpacity
              style={{
                backgroundColor: '#934633',
                padding: 5,
              }}
              onPress={() => {
                setUserSysId('');
                setUserCentro('');
                setUserAlmacen('');
              }}>
              <MaterialIcons name="clear-all" color='#FFF' size={24} />
            </TouchableOpacity>
          }

        </View>


        <View style={{
          flexDirection: 'column',
          margin: 5,
          //justifyContent: 'center',
          //width: '100%'
        }}>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Fecha DM: {fecha}</Text>

          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Clave:</Text>
            <TextInput
              style={{

                width: 150,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: '#ffffff',
              }}

              onChangeText={(value) => {
                setClave(value);
                setEdit(value === '27092211');
              }
              }

              placeholder=''
              keyboardType="numeric"
              returnKeyType="next"
              secureTextEntry={true}

            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >

            <Text>Sistema:</Text>
            <TextInput
              style={{

                width: 150,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: '#ffffff',
                //marginBottom: 5,
                //textTransform: 'uppercase',
              }}

              onChangeText={(userSysIdV) => {
                //console.log(userSysIdV);
                setUserSysId(userSysIdV);
              }

              }

              returnKeyType="next"

              editable={edit}

              value={userSysId}

            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >

            <Text>Centro:</Text>
            <TextInput
              style={{

                width: 150,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: '#ffffff',
              }}

              onChangeText={(userCentrov) => {
                console.log(userCentrov);
                setUserCentro(userCentrov);
                console.log(userCentro);
              }
              }

              keyboardType="numeric"
              returnKeyType="next"
              editable={edit}
              value={userCentro}

            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text>Almacén:</Text>
            <TextInput
              style={{

                width: 150,
                borderColor: 'gray',
                borderWidth: 3,
                paddingHorizontal: 15,
                fontSize: 20,
                borderRadius: 25,
                backgroundColor: '#ffffff',
              }}

              onChangeText={(txtAlmacenv) =>
                setUserAlmacen(txtAlmacenv)
              }

              keyboardType="numeric"
              returnKeyType="next"
              editable={edit}
              clearButtonMode='always'
              value={userAlmacen}

            />
          </View>

          <TouchableOpacity

            disabled={!edit}
            style={{ ...styles.buttonM }}

            onPress={() => {

              console.log(userCentro);

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

              setModalVisible(false);
              setEdit(false);
              setClave('');

            }}>
            <Text style={{ color: 'white', justifyContent: 'center', fontSize: 20 }}>Grabar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
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
    fontSize: 36,
    color: "#38434D",
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
