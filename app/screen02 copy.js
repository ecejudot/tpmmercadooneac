import { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
 
import { _getAllKeys, _remove, _retrieveData, _storeData } from '../js/localdata.js';

export default function ModalScreen2() {

  const [userCentro, setUserCentro] = useState('');
  const [userAlmacen, setUserAlmacen] = useState('');
  const [userSysId, setUserSysId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [id, setId] = useState('');
  const [sku, setSku] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [botellas, setBotellas] = useState('');
  const [screen, setScreen] = useState(1);
  const [prevscreen, setPrevScreen] = useState(1);
  const [skuSel, setSkuSel] = useState({});
  const [top40, setTop40] = useState([]);
  const [top40O, setTop40O] = useState([]);
  const [conteoAlm, setConteoAlm] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [fecha, setFecha] = useState(new Date());

  const { werks } = useLocalSearchParams();
  const { desc } = useLocalSearchParams();

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState();
  const [selectedUbic, setSelectedUbic] = useState();

  const router = useRouter();

  const i = {
    ID: '',
    AUDITORIA: '',
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

  let tkeys = [];

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
            title: `${fecha.toLocaleDateString()} Almacén `
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
                    if (item.tipo === 'A') {
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
                  console.log(newTop40);

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

    });

  }, []);

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

    if (botellas === '' || botellas === '0') {
      alert('Debe ingresar botellas por caja');
      return;
    }

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
      i.ID = `AID${userSysId}.${d.getTime()}`;
    else {
      await _remove(id);
      i.ID = id;
    }

    i.idreg = id;
    i.AUDITORIA = `A_${fy}${fm}${fd}`;
    i.FPREVISTA = `${fy}${fm}${fd}`;
    i.TIPO = 'A';
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
    i.TDR = '';
    i.DDR = '';
    i.PDF = '';

    _storeData(i.ID, JSON.stringify(i)).then(() => {

      alert('Grabado con éxito');
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

    _getAllKeys().then(val1 => {

      try {

        if (val1) {
          let almKeys = val1;


          almKeys.forEach(element => {
            if (element.includes('AID')) {

              let idkey = { id: '' }

              _retrieveData(element).then(val1 => {

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

  return (
    <SafeAreaView style={styles.container}>


      {screen === 1 &&
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

              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => {
                  getkeys();

                }}>
                <MaterialCommunityIcons name='list-box' color='#1a9238ff' size={30} />
              </TouchableOpacity>

            </View>
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

      {screen === 2 &&
        <ScrollView>

          <View
            style={{
              flexDirection: 'column',
              //justifyContent: 'center',
              //alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{skuSel.nrsku} {skuSel.descr}</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}
            >
              <Text style={styles.normal}>Cantidad de cajas</Text>
              <TextInput
                style={{
                  fontSize: 18,
                  backgroundColor: 'yellow',
                  width: 100,
                  borderWidth: 1,
                  height: 40,
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
                marginHorizontal: 10,
              }}
            >
              <Text style={styles.normal}>Botellas x Caja</Text>
              <TextInput
                style={{
                  fontSize: 18,
                  backgroundColor: 'yellow',
                  width: 100,
                  borderWidth: 1,
                  height: 40,
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
                marginHorizontal: 10,
                alignContent: 'center',
                alignItems: 'center',
                borderWidth: 0,
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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                //alignItems: 'center'
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
                  grabarAlm();
                }}
              >
                <Text style={styles.button3}>Grabar</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  //grabarAlm();
                  router.push({
                    pathname: "./screen03",
                    params: { werks: werks, matnr: skuSel.nrsku },
                  }
                  );
                }}
              >
                <Text style={styles.button4}>Foto</Text>
              </Pressable>

            </View>

          </View>
        </ScrollView>
      }


      {screen === 3 &&
        <View style={styles.container}>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => {
              setScreen(1);
            }}>
            <MaterialCommunityIcons name='backspace' color='#1a9238ff' size={24} />
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
            keyExtractor={(item) => item.cont}
          />
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
    alignItems: 'center',
    backgroundColor: '#f3ab8e75'
    //backgroundColor: '#f0ebe975',
    //marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  normal: {
    fontSize: 18,
  },
  button: {
    fontSize: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#934633',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
    color: 'white',
    marginTop: 20,
    width: '80%'
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
});
