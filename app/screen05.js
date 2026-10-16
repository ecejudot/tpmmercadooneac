import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { _retrieveData, _storeData } from '../js/localdata.js';

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
  const [uri01, setUri01] = useState('');
  const [uri02, setUri02] = useState('');
  const [uri03, setUri03] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showList, setShowList] = useState(false);

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
    PDF: '',
    NAMEF1: '',
    NAMEF2: '',
    NAMEF3: '',
    IVNUM: ''
  };

  const recargarFotos = async () => {

    let fotoName = `@foto_${sysId}_${werks}_${idReg}_${ivnum ? ivnum : ''}_${kunnr ? kunnr : ''}`;

    await _retrieveData(`${fotoName}_01`).then((val) => {
      try {
        if (val) {
          if (Platform.OS === 'android')
            setUri01(val);
          else
            setUri01(val);
        }

      } catch {
        console.log("error val foto 1");
      }
    });

    await _retrieveData(`${fotoName}_02`).then((val) => {
      try {

        if (val) {
          if (Platform.OS === 'android')
            setUri02(val);
          else
            setUri02(val);
        }

      } catch {
        console.log("error val foto 2");
      }
    });

    await _retrieveData(`${fotoName}_03`).then((val) => {
      try {

        if (val) {
          if (Platform.OS === 'android')
            setUri03(val);
          else
            setUri03(val);
        }

      } catch {
        console.log("error val foto 3");
      }
    });

  }

  useEffect(() => {

    recargarFotos();

  }
    , [isFocused]);

  useEffect(() => {

    //console.log(Platform.OS);

    setUri01(null);
    setUri02(null);
    setUri03(null);

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
            title: `${fecha.toLocaleDateString()} Reporte `
          })

          let dmkey = `@storage_dm${sysId}${val[0].userCentro}${val[0].userAlmacen}`;

          await _retrieveData(dmkey).then(val1 => {

            try {

              if (val1) {
                let val2 = JSON.parse(val1);
                if (val2) {

                  let aubics = val2.ubicaciones.filter((item) => {
                    if (item.tipo === tipo) {
                      return item;
                    } else {
                      return null;
                    }
                  });

                  setUbicaciones(aubics);

                }
              }

            } catch {
              console.log("error get fecha");
            }
          });

          //recargarFotos();

        }

      } catch {
        console.log("error val");
      }

    });

  }, []);


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


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

      if (selectedUbic === undefined) {
        alert('Debe seleccionar tipo de reporte');
        return;
      }

      if (selectedUbic === '') {
        alert('Debe seleccionar tipo de reporte');
        return;
      }

      i.ID = tipo === '1' ? `MIDREP.${sysId}.${idReg}` : `AIDREP.${sysId}.${idReg}`;
      i.idreg = idReg;
      i.AUDITORIA = ivnum;
      i.IVNUM = ivnum;
      i.CLIENTE = kunnr;
      i.FPREVISTA = `${fy}${fm}${fd}`;
      i.TIPO = 'M';
      i.CENTRO = werks;
      i.SKU = '';
      i.DESCRIPCION = '';
      i.FFRESCURA = `${fy2}${fm2}${fd2}`;
      i.FFRESCURAO = selected;
      i.FCAD = 'NA';
      i.CODIGO = 'NA';
      i.ILEGIBLE = '0';
      i.CDC = '';
      i.BPC = '';
      i.FECHA = `${sy}-${fm}-${fd}`;
      i.HORA = `${fh}:${fmin}:${fs}`;;
      i.USUARIO = userEmail;
      i.UBICACION = selectedUbic;
      i.MDP = 'Sinhallazgoz';
      i.ARCHIVO = 'TPMA';
      i.TDR = selectedUbic;
      i.DDR = text;
      i.PDF = '';

      let fotoName = `@foto_${sysId}_${werks}_${idReg}_${ivnum ? ivnum : ''}_${kunnr ? kunnr : ''}`;

      if (uri01) i.NAMEF1 = `${fotoName}_01`;
      if (uri02) i.NAMEF2 = `${fotoName}_02`;
      if (uri03) i.NAMEF3 = `${fotoName}_03`;


      await _storeData(i.ID, JSON.stringify(i)).then(() => {

        alert('Reporte grabado correctamente');
        router.back();

      });

    } catch (error) {

      alert(`Error al grabar reporte ${error}`);

    }

  };


  return (
    <View style={styles.container}>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.container}>

        {showList &&
          <FlatList
            style={{
              marginTop: 10,
              marginBottom: 40,
            }}
            data={ubicaciones}
            renderItem={({ item }) =>
              <View style={styles.item}>
                <Pressable
                  onPress={() => {
                    setSelectedUbic(item.ubicacion);
                    setShowList(false);
                  }}
                >
                  <Text style={styles.title}>{item.ubicacion}</Text>
                </Pressable>
              </View>}
            keyExtractor={item => item.ubicacion}
          />
        }

        {!showList &&
          <>
            <Pressable onPress={recargarFotos}>
              <Text style={styles.normal}>Tipo de reporte {ivnum}</Text>
            </Pressable>

            <View style={{
              flexDirection: 'row',
              padding: 1,
            }}>
              <TextInput
                style={styles.text}
                onChangeText={newText => setSelectedUbic(newText)}
                value={selectedUbic}
                editable={false}
                placeholder="Seleccione tipo de reporte"
                multiline={true}
              />

              <Pressable
                onPress={() => {
                  setShowList(true);
                }}
              >
                <MaterialCommunityIcons name='filter-variant' color='rgb(151, 28, 12)' size={40} />
              </Pressable>
            </View>



            {/* screen 4: imagenes */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                //alignItems: 'center'
                padding: 10,
              }}
            >

            </View>
            <TextInput
              style={styles.textarea}
              placeholder="Comentarios"
              multiline={true} // This is the key prop for multi-line input
              numberOfLines={6} // Optional: Sets the initial height in terms of lines
              onChangeText={newText => setText(newText)}
              value={text}
              textAlignVertical="top" // Ensures text starts at the top on both iOS and Android
            />

            {/* screen 4: imagenes */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                //alignItems: 'center'
                padding: 10,
              }}
            >

              <Pressable

                style={styles.logo}
                onPress={() => {
                  router.push({
                    pathname: "./screen03",
                    params: {
                      werks: werks,
                      ivnum: ivnum,
                      kunnr: kunnr,
                      sysId: sysId,
                      numFoto: '01',
                      idReg: idReg,
                    },
                  })
                }}
              >
                {uri01 === '' || uri01 === null ?

                  <MaterialCommunityIcons name='camera' color='#1a9238ff' size={90} />

                  :
                  <Image
                    style={styles.logo}
                    source={{
                      uri: uri01
                    }}
                  />
                }
              </Pressable>

              <Pressable
                style={styles.logo}
                onPress={() => {
                  router.push({
                    pathname: "./screen03",
                    params: {
                      werks: werks,
                      ivnum: ivnum,
                      kunnr: kunnr,
                      sysId: sysId,
                      numFoto: '02',
                      idReg: idReg,
                    },
                  })
                }}
              >
                {uri02 === '' || uri02 === null ?

                  <MaterialCommunityIcons name='camera' color='#1a9238ff' size={90} />

                  :
                  <Image
                    style={styles.logo}
                    source={{
                      uri: uri02
                    }}
                  />
                }
              </Pressable>

              <Pressable
                style={styles.logo}
                onPress={() => {
                  router.push({
                    pathname: "./screen03",
                    params: {
                      werks: werks,
                      ivnum: ivnum,
                      kunnr: kunnr,
                      sysId: sysId,
                      numFoto: '03',
                      idReg: idReg,
                    },
                  })
                }}
              >
                {uri03 === '' || uri03 === null ?

                  <MaterialCommunityIcons name='camera' color='#1a9238ff' size={90} />

                  :
                  <Image
                    style={styles.logo}
                    source={{
                      uri: uri03
                    }}
                  />
                }
              </Pressable>

            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                //alignItems: 'center'
              }}
            >

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

          </>}

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
    fontSize: 18,
    //fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
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
  text: {
    //height: 100, // You can set a fixed height or use numberOfLines
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    width: '80%',
  },
  logo: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
});
