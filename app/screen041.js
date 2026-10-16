import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Checkbox } from 'expo-checkbox';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import alert from '../js/alert.js';
import { _getAllKeys, _remove, _removeFew, _retrieveData, _storeData } from '../js/localdata.js';
import grabarAlmacen from '../js/saveAlmacen.js';
import grabarMercado from '../js/saveMercado.js';
import callUploadFile from './../js/callUploadFile.js';

export default function screen041() {

  const [date, setDate] = useState(dayjs());
  const [userCentro, setUserCentro] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('');
  const [userSysId, setUserSysId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [id, setId] = useState('');
  const [sku, setSku] = useState('');
  const [desc, setDesc] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [botellas, setBotellas] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [screen, setScreen] = useState(1);
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
  const { lgort } = useLocalSearchParams();
  const { sysId } = useLocalSearchParams();
  const { ivnum } = useLocalSearchParams();
  const { kunnr } = useLocalSearchParams();
  const { descr } = useLocalSearchParams();
  const { name1 } = useLocalSearchParams();
  const { nueva } = useLocalSearchParams();
  const { ciudad } = useLocalSearchParams();
  const { colonia } = useLocalSearchParams();
  const { entrecalles } = useLocalSearchParams();
  const { estado } = useLocalSearchParams();
  const { municipio } = useLocalSearchParams();
  const { telefono } = useLocalSearchParams();

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const [selected, setSelected] = useState(new Date());
  const [selectedUbic, setSelectedUbic] = useState();
  const [text, setText] = useState('');
  const [uri01, setUri01] = useState('');
  const [uri02, setUri02] = useState('');
  const [uri03, setUri03] = useState('');
  const [mode, setMode] = useState('date');

  const [isCheckedSinCodigo, setCheckedSinCodigo] = useState(false);
  const [isCheckedIlegible, setCheckedILegible] = useState(false);
  const [isCalendar, setCalendar] = useState(false);
  const defaultStyles = useDefaultStyles();

  const router = useRouter();
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
    PDF: '',
    NAME: '',
    NUEVO: true
  };

  useEffect(() => {

    // llena auditorias
    if (sysId) getkeysA(sysId, werks);

  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: `${fecha.toLocaleDateString()} Mercado `
    });

    refresh();

  }, []);

  const refresh = () => {

    let dmkey = `@storage_dm${sysId}99990000`;

    // llena top 40
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

    let conteoAlmKey = `@conteoAlmKey${sysId}${werks}${lgort}`;

    //llena el conteo de almacén
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

    // llena auditorias
    //getkeysA(sysId, werks);

  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setSelected(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: selected,
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
      alert('Debe ingresar cantidad de botellas');
      return;
    }

    let icantidad = + cantidad;

    if (isNaN(icantidad)) {
      setCantidad(' ');
      alert('Debe ingresar cantidad de botellas');
      return
    };

    /*     if (selectedUbic === undefined) {
          alert('Debe seleccionar ubicación');
          return;
        }
    
        if (selectedUbic === '') {
          alert('Debe seleccionar ubicación');
          return;
        } */

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
      i.ID = `MID${userSysId}.${ivnum}.${kunnr}.${d.getTime()}`;
    else {
      await _remove(id);
      i.ID = id;
    }


    i.idreg = id;
    i.AUDITORIA = ivnum;
    i.CLIENTE = kunnr;
    i.FPREVISTA = `${fy}${fm}${fd}`;
    i.TIPO = 'M';
    i.CENTRO = werks;
    i.SKU = skuSel.nrsku;
    i.DESCRIPCION = skuSel.descr;

    if (isCheckedSinCodigo || isCheckedIlegible)
      i.FFRESCURA = ``;
    else
      i.FFRESCURA = `${fy2}${fm2}${fd2}`;

    i.FFRESCURAO = selected;
    i.FCAD = 'NA';
    i.CODIGO = isCheckedSinCodigo ? 1 : 0;
    i.ILEGIBLE = isCheckedIlegible ? 1 : 0;
    i.CDC = cantidad;
    i.BPC = cantidad;
    i.FECHA = `${sy}-${fm}-${fd}`;
    i.HORA = `${fh}:${fmin}:${fs}`;;
    i.USUARIO = userEmail;
    i.UBICACION = selectedUbic;
    i.MDP = 'Sinhallazgoz';
    i.ARCHIVO = 'TPMA';
    i.TDR = text;
    i.DDR = '';
    i.PDF = '';
    i.NAME = name1;
    i.NUEVO = nueva;
    i.TSTAMP = new Date();


    await _storeData(i.ID, JSON.stringify(i)).then(() => {

      clearFields();

    });

    //return;

  };

  const clearFields = () => {

    setSku('');
    setTop40(top40O);
    setScreen(1);
    setCantidad('');
    setBotellas('');
    setSelectedUbic('');
    setSelected(new Date());
    setCheckedILegible(false);
    setCheckedSinCodigo(false);

  }

  const getkeys = () => {

    let tkeys = [];

    _getAllKeys().then(val1 => {

      try {

        if (val1) {

          let almKeys = val1;

          almKeys.forEach(async element => {

            if (element.includes(`MID.${sysId}.${ivnum}.${kunnr}`)) {


              let idkey = { id: '' }

              await _retrieveData(element).then(val1 => {

                try {

                  if (val1) {
                    let val2 = JSON.parse(val1);
                    if (val2) {
                      tkeys.push(val2);
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

  const getkeysA = async (sysId, centro) => {

    await _getAllKeys().then(val1 => {

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

          tkeys.map(async item =>

            await _retrieveData(item.id).then(val1 => {

              try {

                if (val1) {
                  let val2 = JSON.parse(val1);
                  if (val2) {
                    ks.push(val2);
                    setAuditorias(ks);
                  }
                }

              } catch {
                console.log("error get element");
              }
            })
          )

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

  return(
    <View style={styles.container}>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {screen === 0 &&
        <View style={{ flex: 1, width: '100%', marginBottom: 10 }}>
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
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#f5a591ff',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                marginHorizontal: 10,
                alignItems: 'center',
              }}>
                <View style={styles.item3}>
                  <Text style={styles.title}>#{ivnum} {fechaVisita}</Text>
                  <Text style={styles.title}>Comentario: {observaciones}</Text>
                  <Text style={styles.title}>Responsable: {responsable}</Text>
                </View>
                <View>
                  <Pressable
                    style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', padding: 10, }}
                    onPress={() => {

                      let idReg = new Date().getTime().toString().slice(-10);

                      debugger;

                      router.push({
                        pathname: "./screen06",
                        params: {
                          werks: werks,
                          desc: desc,
                          idReg: idReg,
                          ivnum: ivnum,
                          sysId: sysId,
                        },
                      })
                    }}
                  >
                    <MaterialCommunityIcons name="account-plus-outline" size={32} color="black" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        </View>
      }

      {screen === 1 &&
        <View style={{ flex: 1, width: '100%', marginBottom: 10 }}>

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
                  //setScreen(0);
                  router.back();
                }}>
                <MaterialCommunityIcons name='backspace' color='#1a9238ff' size={30} />
              </TouchableOpacity>

              <Text style={styles.title}>#Auditoria: {ivnum}</Text>

              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  getkeys();

                }}>
                <MaterialCommunityIcons name='list-box' color='#1a9238ff' size={30} />
              </TouchableOpacity>

            </View>

            <Pressable
              style={styles.button6}
              onPress={() => { setDetalleCliente(true); setModalVisible(true); }}
            >
              <Text style={styles.title}>{name1}</Text>
            </Pressable>


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
              marginBottom: 50,
            }}
            data={top40}

            renderItem={

              ({ item }) => {

                return (

                  <Pressable
                    onPress={() => {
                      setSku(item.nrsku);
                      //setDesc(item.descr);
                      setSkuSel(item);
                      setPrevScreen(1);
                      setId(undefined);
                      setCantidad('');
                      setBotellas('');
                      setSelectedUbic('');
                      setSelected(new Date());

                      router.push({
                        pathname: "./screen042",
                        params: {
                          werks: werks,
                          lgort: lgort,
                          nrsku: item.nrsku,
                          desc: item.descr,
                          sysId: sysId,
                          ivnum: ivnum,
                          kunnr: kunnr,
                          name1: name1,
                          nueva: nueva,
                        }
                      });

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

      {screen === 2 &&
        <View
          style={{
            flexDirection: 'column',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly'
            }}
          >
            <Text style={styles.title}>{sku}</Text>
            <Text style={styles.title}>{desc}</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}
          >
            <Text style={styles.normal}>Cantidad de botellas</Text>
            <TextInput
              style={{
                fontSize: 18,
                backgroundColor: 'yellow',
                width: 100,
                borderWidth: 1,
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

          <View style={styles.section2}>
            <View style={styles.section}>
              <Checkbox style={styles.checkbox} value={isCheckedIlegible} onValueChange={setCheckedILegible} />
              <Text style={styles.paragraph}>Ilegible</Text>
            </View>

            <View style={styles.section}>
              <Checkbox style={styles.checkbox} value={isCheckedSinCodigo} onValueChange={setCheckedSinCodigo} />
              <Text style={styles.paragraph}>Sin código</Text>
            </View>
          </View>


          {(Platform.OS === 'android' && !isCheckedIlegible && !isCheckedSinCodigo) &&
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
                <Text style={styles.button}> Frescura: {selected.toLocaleDateString()}</Text>
              </Pressable>
            </View>
          }

          {(Platform.OS === 'web' && !isCheckedIlegible && !isCheckedSinCodigo) &&

            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: 10,
              }}
            >

              <Pressable
                onPress={() => {
                  setCalendar(true);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.button}> Frescura: {selected.toLocaleDateString()}</Text>
              </Pressable>

            </View>
          }

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              margin: 20,
            }}
          >

            <Pressable
              onPress={() => {
                clearFields();
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

          <Text style={styles.subtitle}>{mensaje}</Text>

        </View>
      }

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

                let fecha = new Date(item.TSTAMP);
                let backgroundColor = '#f5511f4d';
                let color = 'black';
                let nfecha = new Date(item.FFRESCURAO);

                if (nfecha < new Date()) {
                  backgroundColor = '#0d0202b5';
                  color = 'white';
                }

                return (

                  <Pressable

                    style={{
                      margin: 5,
                      borderWidth: 1,
                      backgroundColor: '#f5511f4d',
                      padding: 10,
                    }}

                    onLongPress={() => {
                      alert('Confirmar', '¿Desea borrar el registro?', [
                        {
                          text: 'Cancelar',
                          onPress: () => { console.log('Cancel Pressed'); },
                          style: 'cancel',
                        },
                        {
                          text: 'OK', onPress: () => {
                            _removeFew([item.ID]).then(() => {
                              getkeys();
                            });
                          }
                        },
                      ]);
                    }}

                    onPress={() => {
                      setId(item.ID);
                      setSku(item.SKU);
                      setCantidad(item.CDC);
                      setBotellas(item.BPC);
                      setSelectedUbic(item.UBICACION);
                      setSelected(new Date(item.FFRESCURAO));
                      item.nrsku = item.SKU;
                      item.descr = item.DESCRIPCION;
                      setDesc(item.DESCRIPCION);
                      setSkuSel(item);
                      setPrevScreen(3);
                      setScreen(2);
                      setCheckedSinCodigo(item.CODIGO);
                      setCheckedILegible(item.ILEGIBLE);
                    }}
                  >
                    <View >
                      <Text style={styles.subtitle}>Fecha Captura: {fecha.toLocaleDateString()}  {fecha.toLocaleTimeString()}</Text>
                      <Text style={styles.subtitle}>{item.SKU} {item.DESCRIPCION}</Text>
                      <Text style={styles.subtitle}>{item.CLIENTE}</Text>
                      <Text style={styles.subtitle}>{item.NAME}</Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',

                        }}
                      >
                        <Text style={[styles.subtitle, { backgroundColor: backgroundColor, color: color }]}>Frescura: {nfecha.toLocaleDateString()}</Text>
                        <Text style={styles.subtitle}>Cajas: {item.BPC}</Text>
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

      <Modal

        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {

        }}>

        {(Platform.OS === 'web' && isCalendar) &&

          <View
            style={{
              flexDirection: 'column',
              //alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderWidth: 1,
              padding: 5,
              marginTop: 80,
              marginHorizontal: 10,
              backgroundColor: '#f0ebe975',
            }}
          >

            <DateTimePicker
              mode="single"
              locale='es'
              styles={defaultStyles}
              date={date}
              onChange={(params) => {
                console.log(params.date);
                setDate(params.date);
                setSelected(params.date);
                setCalendar(false);
                setModalVisible(false);
              }
              }
            />

          </View>
        }

        {!isCalendar &&

          <View
            style={{
              flexDirection: 'column',
              //alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderWidth: 1,
              padding: 5,
              marginTop: 80,
              marginHorizontal: 10,
            }}
          >
            <Text style={styles.normal}>#Cliente: {kunnr}</Text>
            <Text style={styles.normal}>Ciudad: {ciudad}</Text>
            <Text style={styles.normal}>Colonia: {colonia}</Text>
            <Text style={styles.normal}>Entrecalles: {entrecalles}</Text>
            <Text style={styles.normal}>Estado: {estado}</Text>
            <Text style={styles.normal}>Municipio: {municipio}</Text>
            <Text style={styles.normal}>Teléfono: {telefono}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginTop: 5,
              }}
            >
              <Pressable
                style={styles.button5}
                onPress={() => {
                  Linking.openURL(`geo:${auditoria.latitud},${auditoria.longitud}?q=${auditoria.latitud},${auditoria.longitud}(${auditoria.name1})`);
                }}>
                <MaterialCommunityIcons name='location-enter' color='#0a0a0aff' size={30} />
              </Pressable>
              <Pressable
                style={styles.button5}
                onPress={() => {

                  setModalVisible(false);
                  let idReg = new Date().getTime();

                  debugger;

                  router.push({
                    pathname: "./screen05",
                    params: {
                      werks: werks,
                      kunnr: kunnr,
                      ivnum: ivnum,
                      sysId: sysId,
                      idReg: idReg,
                      tipo: '1'
                    }
                  })
                }}>
                <MaterialCommunityIcons name='file-check-outline' color='#0a0a0aff' size={30} />
              </Pressable>

              <Pressable
                style={styles.button5}
                onPress={() => {

                  setModalVisible(false);

                }}>
                <MaterialCommunityIcons name='close' color='#0a0a0aff' size={30} />
              </Pressable>

            </View>
          </View>

        }

      </Modal >

    </View >
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    //alignItems: 'center',
    //backgroundColor: '#f3ab8e75'
    //backgroundColor: '#f0ebe975',
    marginBottom: 50,
  },
  title: {
    fontSize: 18,
    //fontWeight: 'bold',
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
  item3: {
    //fontSize: 20,
    //fontWeight: 'bold',
    //textAlign: 'center',
    margin: 10,
    backgroundColor: '#f5a591ff',
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
  button5: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#aeee40ff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    width: 50,
    textAlign: 'center',
    borderRadius: 5
  },
  button6: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#aeee40ff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    //width: 50,
    textAlign: 'center',
    borderRadius: 5
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
  checkbox: {
    margin: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
  },
  paragraph: {
    fontSize: 25,
  },
});
