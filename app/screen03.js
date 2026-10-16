import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { _retrieveData, _storeData } from '../js/localdata.js';

export default function screen03() {

  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const ref = useRef(null);
  const [mode, setMode] = useState('picture');
  const [uri, setUri] = useState(null);
  const [fecha, setFecha] = useState(new Date());

  const { werks } = useLocalSearchParams();
  const { matnr } = useLocalSearchParams();
  const { ivnum } = useLocalSearchParams();
  const { kunnr } = useLocalSearchParams();
  const { sysId } = useLocalSearchParams();
  const { numFoto } = useLocalSearchParams();
  const { idReg } = useLocalSearchParams();

  useEffect(() => {

    _retrieveData('@storage_key_tpm').then((val1) => {

      try {

        if (val1) {

          navigation.setOptions({
            title: `${werks}.${idReg}.${ivnum ? ivnum : 'n'}.${kunnr ? kunnr : 'n'}`,
          })


        }

      } catch {
        console.log("error val");
      }

    });

  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Permiso para usar la cámara</Text>
        <Button onPress={requestPermission} title="Dar Permiso" />
      </View>
    );
  }


  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const takePicture = async () => {

    const options = { quality: 0.5, base64: true };
    const photo = await ref.current?.takePictureAsync(options);


    if (photo?.uri) {
      setUri(photo.uri);
      let storage_key_photo_uri = `@foto_${sysId ? sysId : ''}_${werks ? werks : ''}_${idReg ? idReg : ''}_${ivnum ? ivnum : ''}_${kunnr ? kunnr : ''}_${numFoto ? numFoto : ''}`;

      //console.log(photo?.base64);
      //console.log(storage_key_photo_uri);
      debugger;

      let error = await _storeData(storage_key_photo_uri, photo.uri);
      if (error)
        alert(error);
      else
        navigation.goBack();
    }

  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={ref}
        mode={mode}
        responsiveOrientationWhenOrientationLocked
      />
      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          {/* <FontAwesome6 name="rotate-left" size={32} color="white" /> */}
        </TouchableOpacity>

        <Pressable onPress={takePicture}>
          {({ pressed }) => (
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  {
                    backgroundColor: "white",
                  },
                ]}
              />
            </View>
          )}
        </Pressable>

        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <FontAwesome6 name="rotate-left" size={32} color="white" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
});

