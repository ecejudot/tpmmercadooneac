import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { _getAllKeys, _remove, _retrieveData, _storeData } from '../js/localdata.js';
import grabarAlmacen from '../js/saveAlmacen.js';
import grabarMercado from '../js/saveMercado.js';
import callUploadFile from './../js/callUploadFile.js';

export default function screen0402() {

  const [userCentro, setUserCentro] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('');
  const [userSysId, setUserSysId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [id, setId] = useState('');
  const [sku, setSku] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [botellas, setBotellas] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [screen, setScreen] = useState(0);
  const [prevscreen, setPrevScreen] = useState(1);
  const [skuSel, setSkuSel] = useState({});
  const [top40, setTop40] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [top40O, setTop40O] = useState([]);
  const [conteoAlm, setConteoAlm] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [fecha, setFecha] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [detalleCliente, setDetalleCliente] = useState(false);
  const { werks } = useLocalSearchParams();
  const { desc } = useLocalSearchParams();

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState();
  const [selectedUbic, setSelectedUbic] = useState();
  const [text, setText] = useState('');
  const [uri01, setUri01] = useState('');
  const [uri02, setUri02] = useState('');
  const [uri03, setUri03] = useState('');

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');

  const router = useRouter();

  const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

  const isFocused = useIsFocused();

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

  const recargarFotos = () => {

    _retrieveData(`@foto_${userSysId ? userSysId : ''}_${werks ? werks : ''}_${skuSel.nrsku ? skuSel.nrsku : ''}_${auditoria.ivnum ? auditoria.ivnum : ''}_${auditoria.kunnr ? auditoria.kunnr : ''}_01`).then((val) => {
      try {

        if (val) {
          if (Platform.OS === 'android')
            setUri01(`data:image/png;base64,${val}`);
          else
            setUri01(val);
        }

      } catch {
        console.log("error val foto 1");
      }
    });

    _retrieveData(`@foto_${userSysId ? userSysId : ''}_${werks ? werks : ''}_${skuSel.nrsku ? skuSel.nrsku : ''}_${auditoria.ivnum ? auditoria.ivnum : ''}_${auditoria.kunnr ? auditoria.kunnr : ''}_02`).then((val) => {
      try {

        if (val) {
          if (Platform.OS === 'android')
            setUri02(`data:image/png;base64,${val}`);
          else
            setUri02(val);
        }

      } catch {
        console.log("error val foto 2");
      }
    });

    _retrieveData(`@foto_${userSysId ? userSysId : ''}_${werks ? werks : ''}_${skuSel.nrsku ? skuSel.nrsku : ''}_${auditoria.ivnum ? auditoria.ivnum : ''}_${auditoria.kunnr ? auditoria.kunnr : ''}_03`).then((val) => {
      try {

        if (val) {
          if (Platform.OS === 'android')
            setUri03(`data:image/png;base64,${val}`);
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

    console.log(Platform.OS);

    setUri01(null);
    setUri02(null);
    setUri03(null);

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
            title: `${fecha.toLocaleDateString()} Mercado `
          })

          let dmkey = `@storage_dm${val[0].userSysId}${val[0].userCentro}${val[0].userAlmacen}`;

          _retrieveData(dmkey).then(val1 => {

            try {

              if (val1) {
                let val2 = JSON.parse(val1);
                if (val2) {
                  let origTop40 = val2.top40;

                  let newTop40 = origTop40.filter((item) => {
                    if (item.werks === werks) {
                      item.min = item.descr;
                      item.min = item.min.toLowerCase();
                      return item
                    }
                    else
                      return null
                  })

                  setTop40(newTop40);
                  setTop40O(newTop40);

                  let aubics = val2.ubicaciones.filter((item) => {
                    if (item.tipo === 'M') {
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

          let conteoAlmKey = `@conteoAlmKey${val[0].userSysId}${val[0].userCentro}${val[0].userAlmacen}`;

          _retrieveData(conteoAlmKey).then(val1 => {

            try {

              if (val1) {
                let val2 = JSON.parse(val1);
                if (val2) {

                  setTop40(newTop40);

                }
              }

            } catch {
              console.log("error get fecha");
            }
          });

          getkeysA(val[0].userSysId, val[0].centroTPM);

          recargarFotos();

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


  const grabarAlm = async () => {

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

    if (cantidad === '' || cantidad === '0') {
      alert('Debe ingresar cantidad de cajas');
      return;
    }

    let icantidad = + cantidad;

    if (isNaN(icantidad)) {
      setCantidad(' ');
      alert('Debe ingresar cantidad de cajas');
      return
    };

    if (botellas === '' || botellas === '0') {
      alert('Debe ingresar botellas por caja');
      return;
    }

    let ibotellas = + botellas;

    if (isNaN(ibotellas)) {
      setBotellas(' ');
      return
    };

    if (selectedUbic === undefined) {
      alert('Debe seleccionar ubicación');
      return;
    }

    if (selectedUbic === '') {
      alert('Debe seleccionar ubicación');
      return;
    }

    if (selected === undefined) {
      alert('Debe seleccionar fecha de frescura');
      return;
    }

    let dsel = new Date(selected);

    let fy2 = dsel.getFullYear();
    let fm2 = dsel.getMonth() + 1;
    let fd2 = dsel.getDate();

    if (fm2 < 10) fm2 = `0${fm2}`;
    if (fd2 < 10) fd2 = `0${fd2}`;

    if (id === undefined)
      i.ID = `MID${userSysId}.${d.getTime()}`;
    else {
      await _remove(id);
      i.ID = id;
    }


    i.idreg = id;
    i.AUDITORIA = auditoria.ivnum;
    i.CLIENTE = auditoria.kunnr;
    i.FPREVISTA = `${fy}${fm}${fd}`;
    i.TIPO = 'M';
    i.CENTRO = werks;
    i.SKU = skuSel.nrsku;
    i.DESCRIPCION = skuSel.descr;
    i.FFRESCURA = `${fy2}${fm2}${fd2}`;
    i.FFRESCURAO = selected;
    i.FCAD = 'NA';
    i.CODIGO = 'NA';
    i.ILEGIBLE = '0';
    i.CDC = cantidad;
    i.BPC = botellas;
    i.FECHA = `${sy}-${fm}-${fd}`;
    i.HORA = `${fh}:${fmin}:${fs}`;;
    i.USUARIO = userEmail;
    i.UBICACION = selectedUbic;
    i.MDP = 'Sinhallazgoz';
    i.ARCHIVO = 'TPMA';
    i.TDR = text;
    i.DDR = '';
    i.PDF = '';

    _storeData(i.ID, JSON.stringify(i)).then(() => {

      //alert('Grabado con éxito');
      setSku('');
      setTop40(top40O);
      setScreen(1);
      setCantidad('');
      setBotellas('');
      setSelectedUbic('');
      setSelected(new Date());

    });

    return;

  };

  const getkeys = () => {

    let tkeys = [];

    _getAllKeys().then(val1 => {

      try {

        if (val1) {

          let almKeys = val1;

          almKeys.forEach(element => {

            if (element.includes(`MID${userSysId}`)) {


              let idkey = { id: '' }

              _retrieveData(element).then(val1 => {

                try {

                  if (val1) {
                    let val2 = JSON.parse(val1);
                    if (val2) {
                      tkeys.push(val2);
                      console.log(val2);
                    }
                  }

                } catch {
                  console.log("error get element");
                }

              });

            }
          });

          setConteoAlm(tkeys);

          setScreen(3);
        }

      } catch {
        console.log("error get all key");
      }
    });

  }

  const getkeysA = (sysId, centro) => {

    _getAllKeys().then(val1 => {

      let tkeys = [];

      try {

        if (val1) {

          let almKeys = val1;

          almKeys.forEach(element => {

            if (element.includes(`TPM.${sysId}.${centro}`)) {

              let idkey = { id: '' }

              idkey.id = element;

              tkeys.push(idkey);

            }
          });

          tkeys.sort((a, b) => a.id.localeCompare(b.id));

          let ks = [];
          let pall = [];

          tkeys.map(async item =>

            pall.push(_retrieveData(item.id).then(val1 => {

              try {

                if (val1) {
                  let val2 = JSON.parse(val1);
                  if (val2) {
                    ks.push(val2);
                  }
                }

              } catch {
                console.log("error get element");
              }
            })
            ));

          Promise.all(pall).then(() => {

            setAuditorias(ks);

            console.log(ks);

          }
          );

        }

      } catch {
        console.log("error get all key");
      } finally {

      }

    });

  }

  const sincronizarResultados = () => {

    setLoading(true);

    setMensaje('Sincronizando resultados...');

    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha1 = new Date().toLocaleDateString();

    _getAllKeys().then((allkeys) => {

      console.log(allkeys);

      allkeys?.forEach(async (tsdm) => {

        if (tsdm.includes(`@foto_${userSysId}_`)) {

          await _retrieveData(tsdm).then((m) => {
            let fileb64 = m?.split(',')[1]; // Quito el encabezado data:image/jpeg;base64,

            if (fileb64)
              m = fileb64;
            //const buffer = Buffer.from(m || '', 'base64');

            let name = '';
            name = tsdm;
            name = name.slice(9, name.length);


            console.log(name);
            console.log(m);
            //_remove(tsdm);

            callUploadFile(m, name).then(() => {
              try {
                _remove(tsdm);
              } catch (error) {
                setMensaje('Error al sincronizar fotos');
                setLoading(false);
              } finally {
                setLoading(false);
              }
            })

          })
        }

        if (tsdm.includes(`AID${userSysId}.`)) {

          await _retrieveData(tsdm).then((m) => {

            grabarAlmacen(m).then((resp) => {
              try {
                //_remove(tsdm);
              } catch (error) {
                setMensaje('Error al sincronizar almacén');
                setLoading(false);
              } finally {
                setLoading(false);
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

        if (tsdm.includes(`MID${userSysId}.`)) {

          await _retrieveData(tsdm).then((m) => {

            grabarMercado(m).then((resp) => {
              try {
                //_remove(tsdm);
              } catch (error) {
                setMensaje('Error al sincronizar mercado');
                setLoading(false);
              } finally {
                setLoading(false);
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

        setMensaje('Terminado');
        setLoading(false);

      }
      )


    });
  }

  return (
    <SafeAreaView style={styles.container}>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* screen 0: seleccionar auditoria */}
      {screen === 0 &&
        <View style={styles.container}>

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={styles.title}>Seleccione auditoría</Text>

            </View>
          </View>

          <SectionList
            sections={auditorias}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setAuditoria(item);
                  setScreen(1);
                }}
              >
                <View style={styles.item}>
                  <Text style={styles.header}>{item.kunnr}</Text>
                  <Text style={styles.header}>{item.name1}</Text>
                  <Text style={styles.header}>{item.calle}, {item.colonia}, {item.ciudad}</Text>
                </View>
              </Pressable>
            )}
            renderSectionHeader={({ section: { ivnum, fechaVisita, observaciones, responsable } }) => (
              <View style={styles.item2}>
                <Text style={styles.title}>#{ivnum} F. visita: {fechaVisita}</Text>
                <Text style={styles.title}>C: {observaciones}</Text>
                <Text style={styles.title}>R: {responsable}</Text>
              </View>
            )}
          />
        </View>
      }

      {/* screen 1: seleccionar sku + datos de cliente */}
      {screen === 1 &&
        <View style={{ flex: 1, width: '100%' }}>

          <View
            style={{
              flexDirection: 'column',
              //alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderWidth: 1,
              padding: 5,
              width: '100%'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',

              }}
            >
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  setScreen(0);
                }}>
                <MaterialCommunityIcons name='backspace' color='#1a9238ff' size={30} />
              </TouchableOpacity>

              <Text style={styles.title}>#Auditoria: {auditoria.ivnum}</Text>

              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  getkeys();

                }}>
                <MaterialCommunityIcons name='list-box' color='#1a9238ff' size={30} />
              </TouchableOpacity>

            </View>

            <Pressable
              onPress={() => { setDetalleCliente(!detalleCliente); }}
            >
              <Text style={styles.title}>{auditoria.name1}</Text>
            </Pressable>

            {detalleCliente &&
              <View
                style={{
                  flexDirection: 'column',
                  //alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  padding: 5,
                  width: '100%'
                }}
              >
                <Text style={styles.normal}>#Cliente {auditoria.kunnr}</Text>
                <Text style={styles.normal}>Ciudad {auditoria.ciudad}</Text>
                <Text style={styles.normal}>Colonia {auditoria.colonia}</Text>
                <Text style={styles.normal}>Entrecalles {auditoria.entrecalles}</Text>
                <Text style={styles.normal}>Estado {auditoria.estado}</Text>
                <Text style={styles.normal}>Municipio {auditoria.municipio}</Text>
                <Text style={styles.normal}>Teléfono {auditoria.telefono}</Text>
                <Pressable
                  onPress={() => {
                    Linking.openURL(`geo:${auditoria.latitud},${auditoria.longitud}?q=${auditoria.latitud},${auditoria.longitud}(${auditoria.name1})`);
                  }}>
                  <Text style={styles.button}>Ubicación</Text>
                </Pressable>
              </View>
            }
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 5,
            }}
          >

            <Text style={styles.title}>Ingrese sku</Text>


            <TextInput
              style={{
                fontSize: 20,
                backgroundColor: 'yellow',
                width: 200,
                marginLeft: 5,
              }}

              autoFocus={true}

              onChangeText={(txt) => {

                setSku(txt);

                if (txt === '') {
                  setTop40(top40O);
                } else {
                  let newtop = top40O.filter(item => {
                    let str = item.nrsku + ' ' + item.descr + ' ' + item.min;
                    if (str.includes(txt))
                      return item;
                    else
                      return null;
                  })

                  setTop40(newtop);

                }

              }

              }

              blurOnSubmit={false}

              onSubmitEditing={() => {

                let newtop = top40O.filter(item => {
                  if (item.nrsku === sku)
                    return item;
                  else
                    return null;
                })

                if (newtop.length === 1) {
                  setSkuSel(newtop[0]);
                  setPrevScreen(1);
                  setId(undefined);
                  setCantidad('');
                  setBotellas('');
                  setSelectedUbic('');
                  setSelected(new Date());
                  setScreen(2);
                }

              }

              }
              value={sku}

              returnKeyType="next"

            />

          </View>

          <FlatList

            style={{
              borderTopWidth: 1,
              borderBottomWidth: 1,
            }}
            data={top40}

            renderItem={

              ({ item }) => {

                return (

                  <Pressable
                    onPress={() => {
                      setSku(item.nrsku);
                      setSkuSel(item);
                      setPrevScreen(1);
                      setId(undefined);
                      setCantidad('');
                      setBotellas('');
                      setSelectedUbic('');
                      setSelected(new Date());
                      setScreen(2);
                    }}
                  >
                    <View style={{
                      margin: 5,
                      borderWidth: 1,
                    }}>
                      <Text style={styles.subtitle}>{item.nrsku} - {item.descr}</Text>
                    </View>
                  </Pressable>
                )
              }

            }
            keyExtractor={(item) => item.cont}

          />
        </View>
      }

      {/* screen 2: capturar botellas */}
      {screen === 2 &&

        <View
          style={{
            flexDirection: 'column',
            //justifyContent: 'center',
            //alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
              //alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{skuSel.nrsku}</Text>
            <Text style={styles.title}>{skuSel.descr}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}
          >
            <Text style={styles.normal}>Cantidad de cajas</Text>
            <TextInput
              style={{
                fontSize: 18,
                backgroundColor: 'yellow',
                width: 100,
                borderWidth: 1,
                //height: 40,
                padding: 5,
              }}

              autoFocus={true}

              onChangeText={(txt) => {

                setCantidad(txt);

              }

              }

              onSubmitEditing={() => {


              }

              }
              value={cantidad}

              returnKeyType="next"

              keyboardType='numeric'

            />


          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}
          >
            <Text style={styles.normal}>Botellas x Caja</Text>
            <TextInput
              style={{
                fontSize: 18,
                backgroundColor: 'yellow',
                width: 100,
                borderWidth: 1,
                //height: 40,
                padding: 5,
              }}

              //autoFocus={true}

              onChangeText={(txt) => {

                setBotellas(txt);

              }

              }

              onSubmitEditing={() => {


              }

              }
              value={botellas}

              returnKeyType="next"

              keyboardType='numeric'

            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              margin: 5,
            }}
          >
            <Text style={styles.normal}>Ubicación</Text>
            <Picker
              mode="dropdown"
              style={{
                height: 50,
                width: 250,
                borderWidth: 1,
                borderColor: 'black',
              }}

              selectedValue={selectedUbic}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedUbic(itemValue)
              }

              }>
              <Picker.Item label='' value='' />
              {
                ubicaciones.map((ubic) => {
                  return (<Picker.Item label={ubic.ubicacion} value={ubic.ubicacion} />)
                })
              }

            </Picker>
          </View>

          {(Platform.OS === 'web') &&
            <DateTimePicker
              mode="single"
              locale="es-ES"
              date={selected}
              onChange={({ date }) => setSelected(date)}
              styles={defaultStyles}
              style={{
                //width: '90%',
                marginHorizontal: 10,
                borderWidth: 1,
                borderColor: 'black',
                //backgroundColor: 'lightgrey',
              }}
            />
          }

          {Platform.OS === 'android' &&
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: 10,
              }}
            >
              <Pressable
                onPress={showDatepicker}
              >
                <Text style={styles.button}> Frescura: {date.toLocaleDateString()}</Text>
              </Pressable>
            </View>
          }

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              //alignItems: 'center'
              margin: 20,
            }}
          >

            <Pressable
              onPress={() => {
                setSku('');
                setTop40(top40O);
                setScreen(prevscreen);
                setCantidad('');
                setBotellas('');
              }}
            >
              <Text style={styles.button2}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setScreen(4);
                //grabarAlm();
              }}
            >
              <Text style={styles.button3}>Grabar</Text>
            </Pressable>

          </View>

          <Text style={styles.subtitle}>{mensaje}</Text>

        </View>

      }

      {/* screen 3: lista de lo ya capturado */}
      {screen === 3 &&
        <View style={styles.container}>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => {
              setScreen(1);
            }}>
            <MaterialCommunityIcons name='backspace' color='#1a9238ff' size={30} />
          </TouchableOpacity>
          <FlatList
            data={conteoAlm}

            renderItem={

              ({ item }) => {

                return (

                  <Pressable

                    style={{
                      margin: 5,
                      borderWidth: 1,
                      backgroundColor: '#f5511f4d',
                      padding: 10,
                    }}

                    onPress={() => {
                      setId(item.ID);
                      setSku(item.SKU);
                      setCantidad(item.CDC);
                      setBotellas(item.BPC);
                      setSelectedUbic(item.UBICACION);
                      setSelected(item.FFRESCURAO);
                      item.nrsku = item.SKU;
                      item.descr = item.DESCRIPCION;
                      setSkuSel(item);
                      setPrevScreen(3);
                      setScreen(2);
                    }}
                  >
                    <View >
                      <Text style={styles.subtitle}>{item.SKU} {item.DESCRIPCION}</Text>
                      <Text style={styles.subtitle}>{item.UBICACION}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',

                        }}
                      >
                        <Text style={styles.subtitle}>{item.FFRESCURA}</Text>
                        <Text style={styles.subtitle}>{item.BPC}</Text>
                        <Text style={styles.subtitle}>{item.CDC}</Text>
                      </View>
                    </View>
                  </Pressable>
                )
              }

            }
            keyExtractor={(item) => item.ID}
          />
        </View>
      }

      {/* screen 4: levantar reporte 1 */}
      {screen === 4 &&
        <View style={styles.container}>

          <TextInput
            style={styles.textarea}
            placeholder="Comentarios"
            multiline={true} // This is the key prop for multi-line input
            numberOfLines={4} // Optional: Sets the initial height in terms of lines
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
                    matnr: skuSel.nrsku,
                    ivnum: auditoria.ivnum,
                    kunnr: auditoria.kunnr,
                    sysId: userSysId,
                    numFoto: '01',
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
                    matnr: skuSel.nrsku,
                    ivnum: auditoria.ivnum,
                    kunnr: auditoria.kunnr,
                    sysId: userSysId,
                    numFoto: '02',
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
                    matnr: skuSel.nrsku,
                    ivnum: auditoria.ivnum,
                    kunnr: auditoria.kunnr,
                    sysId: userSysId,
                    numFoto: '03',
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
                setScreen(2);
              }}
            >
              <Text style={styles.button2}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                grabarAlm();
              }}
            >
              <Text style={styles.button3}>Grabar</Text>
            </Pressable>


          </View>

        </View>
      }

      <Modal

        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(false);
          setEdit(false);
        }}>


        <FlatList
          data={top40}
          renderItem={

            ({ item }) => {

              return (

                <Pressable
                  onPress={() => {

                  }}
                >
                  <View style={{
                    margin: 5,
                    borderWidth: 1,
                  }}>
                    <Text style={styles.subtitle}>{item.nrsku} - {item.descr}</Text>
                  </View>
                </Pressable>
              )
            }

          }
          keyExtractor={(item) => item.cont}
        />

      </Modal >

    </SafeAreaView >
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
    height: 100, // You can set a fixed height or use numberOfLines
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  logo: {
    width: 100,
    height: 100,
    borderWidth: 1,
  },
});
