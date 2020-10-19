import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Platform, AppRegistry } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { Root, Popup } from 'popup-ui'
import AnimatedLoader from 'react-native-animated-loader'

import {
  setTestDeviceIDAsync,
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from "expo-ads-admob";

export default function App() {
  const [visible, setVisible] = useState(false);


	const askForPermission = async () => {
		const permissionResult = await Permissions.askAsync(Permissions.CAMERA)
		if (permissionResult.status !== 'granted') {
			alert('no permissions to access camera!', [{ text: 'ok' }])
			return false
		}
		return true
  }

	const takeImage = async () => {
		// make sure that we have the permission
		const hasPermission = await askForPermission()
		if (!hasPermission) {
			return
		} else {
			// launch the camera with the following settings
			let image = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [3, 3],
				quality: 1,
				base64: true,
			})
			// make sure a image was taken:
			if (!image.cancelled) {
        {setVisible(true)}
				const response = await fetch('http://13.78.37.131:5000/', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					// send our base64 string as POST request
					body: JSON.stringify({
						imgsource: image.base64,
					}),
        })
        
        const result = await response.text()
        {setVisible(false)}
        const parsed = result.replace(/[\n]+/g, '');
        console.log(parsed)
        if (parsed == "True") {
          // TODO change to other alert UI
          return (
            <Root>
              <View style={styles.container}>
                {Popup.show({
                  type: 'Danger',
                  title: 'Please check again',
                  button: true,
                  textBody: 'There is Fukushima(福島) word',
                  buttonText: 'Ok',
                  callback: () => Popup.hide()
                })}
              </View>
            </Root>
          );

        }else {
          return (
            <Root>
              <View style={styles.container}>
                {Popup.show({
                  type: 'Success',
                  title: 'Great',
                  button: true,
                  textBody: 'There is no Fukushima(福島) word',
                  buttonText: 'Ok',
                  callback: () => Popup.hide()
                })}
              </View>
            </Root>
          );
        }
			}
    }
  }
  


  const setTestID = async () => {
    await setTestDeviceIDAsync('EMULATOR');
    // await setTestDeviceIDAsync('35 737609 881230 1');
  }
  const bannerError = (e) => {
    console.log("An error : "+ e);
    return;
  }

  const showInterstitial = async () => {
    AdMobInterstitial.setAdUnitID('ca-app-pub-4002786977128549/2057072189'); // Test ID, Replace with your-admob-unit-id
    await setTestDeviceIDAsync('35 737609 881230 1');
    try{ 
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    }
    catch(e){
      console.log(e);
    }
  }
  const setAdUnitId = () => {
    if (Platform.OS === 'ios') {
      AdMobBanner.adUnitID = "ca-app-pub-4002786977128549/2057072189"
    }else {
      AdMobBanner.adUnitID = "ca-app-pub-4002786977128549/5940943469"
    }
  }

  return (
    <Root>
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={require("./loader.json")}
        animationStyle={styles.lottie}
        speed={1}
      />
      <View style={styles.container}>
        <Button title="Take a photo" onPress={takeImage} />

        <Text style={styles.explanation}>
           * Please select low quality mode on camera. {"\n"}(if size is more than 4MB, it is not working well)
        </Text>
        <Text style={styles.explanation}>
           
        </Text>
        <AdMobBanner
          style={styles.bottomBanner}
          bannerSize="smartBannerPortrait"
          // bannerSize="fullBanner"
          // actual my id
          adUnitID="ca-app-pub-4002786977128549/5940943469"
          servePersonalizedAds
          onDidFailToReceiveAdWithError={bannerError}
        /> 
      </View>
    </Root>
  )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  },
  explanation: {
    position: "absolute",
    bottom: 60
  },
  lottie: {
    width: 100,
    height: 100
  },

  spContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d35400',
  },
  spinner: {
    marginBottom: 50
  },

  btn: {
    marginTop: 20
  },

  text: {
    color: "white"
  }
})