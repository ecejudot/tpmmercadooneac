import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options, extra) => {

    const result = window.confirm([title, description].filter(Boolean).join('\n'))

    console.log(options);

    if (options) {
        if (result) {
            options[1].onPress()
        } else {
            options[0].onPress()
        }
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert
