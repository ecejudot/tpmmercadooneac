import AsyncStorageWeb from '@react-native-async-storage/async-storage';
import AsyncStorage from 'expo-sqlite/kv-store';
import {
  Platform,
} from 'react-native';

export const _storeData = async (key, value) => {

  if (Platform.OS === 'android') {
    try {
      await AsyncStorage.setItem(
        key,
        value
      );
    } catch (error) {
      return error;
    }
  } else {
    try {
      await AsyncStorageWeb.setItem(
        key,
        value
      );
    } catch (error) {
      return error;
    }
  }


};

export const _retrieveData = async (key) => {

  if (Platform.OS === 'android') {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          // We have data!!
          //console.log(value);
          resolve(value);
        } else {
          reject('error get data');
        }
      } catch (error) {
        // Error retrieving data
        console.log('error get data');
        reject(error);
      }
    });
  } else {
    return new Promise(async (resolve, reject) => {

      try {
        const value = await AsyncStorageWeb.getItem(key);
        if (value !== null) {
          // We have data!!
          //console.log(value);
          resolve(value);
        } else {
          reject('error get data');
        }
      } catch (error) {
        // Error retrieving data
        console.log('error get data');
        reject(error);
      }
    });
  }

};

export const _getAllKeys = async () => {
  let keys = []

  if (Platform.OS === 'android') {
    try {
      keys = await AsyncStorage.getAllKeys();

      //console.log(keys);
      return keys;
    } catch (e) {
      // read key error
      console.log(e);
    }
  } else {
    try {
      keys = await AsyncStorageWeb.getAllKeys();

      //console.log(keys);
      return keys;
    } catch (e) {
      // read key error
      console.log(e);
    }
  }

}


export const _removeFew = async (keys) => {

  if (Platform.OS === 'android') {
    try {
      await AsyncStorage.multiRemove(keys)
      console.log('Done')
    } catch (e) {
      // remove error
      console.log('error' + e)
    }
  } else {
    try {
      await AsyncStorageWeb.multiRemove(keys)
      console.log('Done')
    } catch (e) {
      // remove error
      console.log('error' + e)
    }
  }

}

export const _remove = async (key) => {

  if (Platform.OS === 'android') {
    try {
      await AsyncStorage.removeItem(key);
      console.log('Done')
    } catch (e) {
      // remove error
      console.log('error' + e)
    }
  } else {
    try {
      await AsyncStorageWeb.removeItem(key);
      console.log('Done')
    } catch (e) {
      // remove error
      console.log('error' + e)
    }
  }


}
// const { getItem, setItem } = useAsyncStorage('@storage_key_tpm');

// export const getData = async () => {
//     try {
//         const value = await getItem();
//         return value;
//     } catch (e) {
//         // error reading value
//     }
// }

// export const storeData = async (value) => {
//     try {
//         await setItem(value)
//         //setValue(value);
//     } catch (e) {
//         // saving error
//     }
// }

// const { getItemDM, setItemDM } = useAsyncStorage('@storage_dm');

// export const storeDataDM = async (value) => {
//     try {
//         console.log(value);
//         await setItemDM(value)
//         //setValue(value);
//     } catch (e) {
//         // saving error
//     }
// }

// export const getDataDM = async () => {
//     try {
//         const value = await getItemDM();
//         return value;
//     } catch (e) {
//         // error reading value
//         console.log("error get dm");
//     }
// }

