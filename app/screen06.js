import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { _getAllKeys, _remove, _retrieveData, _storeData } from '../js/localdata.js';

export default function screen05() {

  const [userCentro, setUserCentro] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('');
  const [userSysId, setUserSysId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [id, setId] = useState('');
  const [ubicaciones, setUbicaciones] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [selectedUbic, setSelectedUbic] = useState();
  const [text, setText] = useState('');
  const [nombre, setNombre] = useState('');
  const [calle, setCalle] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [location, setLocation] = useState({});

  const { werks } = useLocalSearchParams();
  const { ivnum } = useLocalSearchParams();
  const { kunnr } = useLocalSearchParams();
  const { sysId } = useLocalSearchParams();
  const { tipo } = useLocalSearchParams();
  const { idReg } = useLocalSearchParams();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const router = useRouter();

  const i = {
    ID: '',
    AUDITORIA: '',
    CLIENTE: '',
    FPREVISTA: '',
    TIPO: '',
    CENTRO: '',
    SKU: '',
    DESCRIPCION: '',
    FFRESCURA: '',
    FFRESCURAO: '',
    FCAD: '',
    CODIGO: '',
    ILEGIBLE: '',
    CDC: '',
    BPC: '',
    FECHA: '',
    HORA: '',
    USUARIO: '',
    UBICACION: '',
    MDP: '',
    ARCHIVO: '',
    TDR: '',
    DDR: '',
    PDF: ''
  };


  useEffect(() => {

    _retrieveData('@storage_key_tpm').then(async (val1) => {

      try {

        if (val1) {

          const val = JSON.parse(val1);

          setUserSysId(val[0].userSysId);
          setUserCentro(val[0].centroTPM);
          setUserAlmacen(val[0].userAlmacen);
          setUserEmail(val[0].userEmail);
          setUserCentro(val[0].descCentroTPM);

          navigation.setOptions({
            title: `${ivnum} Nuevo cliente `
          })



        }

      } catch {
        console.log("error val");
      }

    });

  }, []);




  const grabarReporte = async () => {

    

    try {

      let d = new Date();

      let fy = d.getFullYear();
      let sy = String(fy).slice(2, 4);
      let fm = d.getMonth() + 1;
      let fd = d.getDate();

      if (fm < 10) fm = `0${fm}`;
      if (fd < 10) fd = `0${fd}`;

      let fh = d.getHours();
      let fmin = d.getMinutes();
      let fs = d.getSeconds();

      if (fh < 10) fh = `0${fh}`;
      if (fmin < 10) fmin = `0${fmin}`;
      if (fs < 10) fs = `0${fs}`;

      let dsel = new Date(selected);

      let fy2 = dsel.getFullYear();
      let fm2 = dsel.getMonth() + 1;
      let fd2 = dsel.getDate();

      if (fm2 < 10) fm2 = `0${fm2}`;
      if (fd2 < 10) fd2 = `0${fd2}`;

      if (nombre === undefined) {
        alert('Debe ingresar nombre del cliente');
        return;
      }

      if (nombre === '') {
        alert('Debe ingresar nombre del cliente');
        return;
      }

      await _getAllKeys().then(val1 => {

        let tkeys = [];

        try {

          if (val1) {

            let almKeys = val1;

            almKeys.forEach(element => {

              if (element.includes(`TPM.${sysId}.${werks}.${ivnum}`)) {

                _retrieveData(element).then(tpm => {
                  tpm = JSON.parse(tpm);
                  let data = [];
                  if (tpm.data)
                    data = tpm.data;

                  let linea = {};
                  linea.kunnr = idReg;
                  linea.name1 = nombre;
                  linea.calle = calle;
                  linea.ivnum = ivnum;
                  linea.werks = werks;
                  linea.latitud = location.latitude;
                  linea.longitud = location.longitude;
                  linea.nueva = true;
                  data.push(linea);

                  tpm.data = data;

                  _remove(element).then( () => {
                    _storeData(element,JSON.stringify(tpm)).then(router.back());
                  }
                    
                  )

                })

              }
            });
          }
        } catch {
          console.log("error get all key");
        } finally {

        }
      }
      )

      _storeData('hola', 'mundo').then(() => {

        //alert('Reporte grabado correctamente');
        //router.back();

      });

    } catch (error) {

      alert(`Error al grabar reporte ${error}`);

    }

  };


  return (
    <View style={styles.container}>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.container}>

        <Pressable onPress={ () => {

        }
        }>
          <Text style={styles.normal}>Ingresar nuevo cliente "{idReg}"</Text>
        </Pressable>

        {/* nombre */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <Text style={styles.title}>Nombre</Text>
          <TextInput
            style={{
              fontSize: 20,
              backgroundColor: 'yellow',
              width: '60%',
              marginLeft: 5,
            }}

            autoFocus={true}

            onChangeText={(txt) => {

              setNombre(txt);

            }

            }

            blurOnSubmit={false}

            onSubmitEditing={() => {



            }

            }
            value={nombre}

            returnKeyType="next"

          />

        </View>

        {/* calle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <Text style={styles.title}>Calle</Text>
          <TextInput
            style={{
              fontSize: 20,
              backgroundColor: 'yellow',
              width: '60%',
              marginLeft: 5,
            }}


            onChangeText={(txt) => {

              setCalle(txt);

            }

            }

            blurOnSubmit={false}

            onSubmitEditing={() => {



            }

            }
            value={calle}

            returnKeyType="next"

          />

        </View>

        {/* ubicacion */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <Text style={styles.title}>Latitud</Text>
          <TextInput
            style={{
              fontSize: 20,
              //sbackgroundColor: 'yellow',
              //width: 200,
              marginLeft: 5,
            }}


            onChangeText={(txt) => {


            }

            }

            blurOnSubmit={false}

            onSubmitEditing={() => {



            }

            }
            value={location.latitude}

            disabled={true}

            returnKeyType="next"

          />

        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 10,
          }}
        >
          <Text style={styles.title}>Longitud</Text>
          <TextInput
            style={{
              fontSize: 20,
              //backgroundColor: 'yellow',
              //width: 200,
              marginLeft: 5,
            }}


            onChangeText={(txt) => {


            }

            }

            blurOnSubmit={false}

            onSubmitEditing={() => {



            }

            }
            value={location.longitude}

            disabled={true}

            returnKeyType="next"

          />

        </View>

        {/* botones */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            //alignItems: 'center'
          }}
        >

          <Pressable
            onPress={() => {
              (async () => {
                setLoading(true);
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                  //setErrorMsg('Permission to access location was denied');
                  return;
                }

                try {
                  let location1 = await Location.getCurrentPositionAsync({});
                  setLoading(false);
                  setLocation(location1.coords);
                  console.log(location);
                } catch (error) {
                  console.log(error);
                  setLocation()
                  setLoading(false);
                }

              })();
            }}
          >
            <Text style={styles.button2}>Ubicación</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.button2}>Cancelar</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              grabarReporte();
            }}
          >
            <Text style={styles.button3}>Grabar</Text>
          </Pressable>


        </View>

      </View>

    </View >
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    //alignItems: 'center',
    //backgroundColor: '#f3ab8e75'
    //backgroundColor: '#f0ebe975',
    //marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    fontSize: 14,
    //fontWeight: 'bold',
    //textAlign: 'center',
    color: 'white',
  },
  item: {
    //fontSize: 20,
    //fontWeight: 'bold',
    //textAlign: 'center',
    margin: 10,
    backgroundColor: '#934633',
    boxShadow: '0 2px 4px rgba(226, 210, 210, 0.25)',
    padding: 5,
  },
  item2: {
    //fontSize: 20,
    //fontWeight: 'bold',
    //textAlign: 'center',
    margin: 10,
    backgroundColor: '#f5a591ff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    padding: 5,
  },
  normal: {
    fontSize: 18,
    padding: 5,
  },
  button: {
    fontSize: 28,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#934633',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
  },
  button2: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#934633',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    width: 120,
    textAlign: 'center',
    borderRadius: 5.
  },
  button3: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#1b9452ff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    width: 120,
    textAlign: 'center',
    borderRadius: 5.
  },
  button4: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#87c51dff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    width: 120,
    textAlign: 'center',
    borderRadius: 5.
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  subtitle: {
    fontSize: 16,
    //backgroundColor: '#eed3ccff',
    padding: 5,
  },
  textarea: {
    //height: 100, // You can set a fixed height or use numberOfLines
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
});
