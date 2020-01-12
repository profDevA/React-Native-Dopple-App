
'use strict';

import React from 'react';
import {   StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
 } from 'react-native';
import { toastr } from '../component/toastComponent'
import  ModalComponent  from '../component/modalComponent'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import firebase from 'react-native-firebase'
import { Spinner } from 'native-base'
import FBLogin from '../Resources/facebook.png';
import CookieManager from 'react-native-cookies';

const screenWidth = Math.round(Dimensions.get('window').width);

export default class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            mailvalidate:false,
            modalVisible: false,
            loading :false,
        };
      
    }

    componentDidMount(){
      // CookieManager.clearAll()
      CookieManager.clearAll()
  .then((res) => {
    console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
  });
    }
    toggleModal = () =>{
      this.setState({modalVisible:false})
      this.passwordTxt.clear()
      this.emailTxt.clear()
      this.setState({ email:'',password:''})
      this.props.navigation.navigate('Menu')
    }

    handleEmail = (text) => {
      this.setState({mailvalidate:false})
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(reg.test(text) === false)
      {
        
        // this.setState({email:text})
        return false;
      }
      else {
        this.setState({email:text})
        this.setState({mailvalidate:true})
        
      }
    }
    
    emailVaidate =() =>{
      if(!this.state.mailvalidate)
        toastr.showToast('Invalidating Email formmating',2500)
    }

    handlePassword = (text) =>{
      this.setState({password:text})
    }
   handleLogin = async () =>{
      const{ email, password } = this.state
      if(!email || !password){
        toastr.showToast("Please input the email and password",3500)
      } else{
        this.setState({loading:true})

            // fetch('http://192.168.207.54:7002/Api/reg', {
            fetch('http://dopplle.net/Api/reg', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body:'email'+'='+ email+'&'+'password'+'='+ password+'&'+ 'reg'+'='+ 'no'
              }).then((response) => response.json())
                .then(async(responseJson) => {
                  
                  if(responseJson[1].message =='Login Successfully'){
                    await  AsyncStorage.setItem('userId',responseJson[0].user );
                    await  AsyncStorage.setItem('eMail',email);
                    await  AsyncStorage.setItem('googlefacebook',"Email" );
                    this.setState({modalVisible:true})
                    this.setState({loading:false})
                  } else if(responseJson[1].message =='The password is not correct')
                  {
                    toastr.showToast(responseJson[1].message,3500)
                    this.setState({loading:false})
                  }
                  console.log(responseJson[0].user)
                  this.setState({loading:false})
                })
                .catch((error) => {
                  console.log(error);
                  this.setState({loading:false})
          });
      }
      
    }

    handleForgot=()=>{
      this.props.navigation.navigate('Forgot')
    }

    handleGoRegister =() =>{
      this.props.navigation.navigate('Register')
    }

    _signIn = async () => {
      try {
      
        await GoogleSignin.configure();

        await GoogleSignin.hasPlayServices();
        const data = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        // create a new firebase credential with the token
        this.setState({loading:true})
        const credential = firebase.auth.GoogleAuthProvider.credential(tokens.idToken, tokens.accessToken)
        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
        
        // console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));
        console.log(firebaseUserCredential.user.photoURL)
        await AsyncStorage.setItem('googlefacebook',"Google" );
        this.insertInformation(firebaseUserCredential.user.displayName,firebaseUserCredential.user.email,firebaseUserCredential.user.photoURL)
        
        
      
      } catch (e) {
        console.log(e);
      }
    };
  
  /***
   *  The function is used for Facebook login
   */
  _fbAuth = async () => {
    try {
      await LoginManager.logInWithPermissions(['public_profile', 'email', 'user_friends']);
      const accessTokenData = await AccessToken.getCurrentAccessToken();
      this.setState({loading:true})
      const credential = firebase.auth.FacebookAuthProvider.credential(accessTokenData.accessToken);
      console.log("token: " + accessTokenData.accessToken);
      const facebookUserCredential = await firebase.auth().signInWithCredential(credential);
      await AsyncStorage.setItem('googlefacebook',"Facebook" );

      console.log(facebookUserCredential.additionalUserInfo.profile.last_name);
       console.log(facebookUserCredential.user.displayName + facebookUserCredential.user.email + facebookUserCredential.user.photoURL);
      this.insertInformation(facebookUserCredential.user.displayName, facebookUserCredential.user.email, facebookUserCredential.user.photoURL,facebookUserCredential.additionalUserInfo.profile.first_name,facebookUserCredential.additionalUserInfo.profile.last_name);
    } catch (e) {
      console.log(e);
    }
   };
  /**
   * This function is used for google login
   * Return parameter: userId
   */
  insertInformation = (userName,email,photourl,firstname="",lastname="") =>{
    // fetch('http://192.168.207.54:7002/Api/reg', {
    fetch('http://dopplle.net/Api/reg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body:'firstname'+'='+firstname+'&'+ 'lastname'+'='+lastname+'&'+ 'email'+'='+ email+'&'+ 'username'+'='+ userName+'&'+ 'password'+'='+ ""+'&'+ 'photourl'+'='+ photourl+'&'+ 'google'+'='+ "yes"+'&'+'reg'+'='+ 'yes'
      }).then((response) => response.json())
       
              .then((responseJson) => {
               console.log(responseJson[0].user)
               this.setState({loading:false})
               AsyncStorage.setItem('userId',responseJson[0].user );
               this.props.navigation.navigate('Menu')
               
        });
  }

    render() {
       const {loading } = this.state
      return (
        <ScrollView >
                <View style={styles.container}>
                  
                   {loading && (
                      <Spinner
                        style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                        color='#f26727' />
                   )}
                  <Image source={require('../Resources/logo.png')} style={styles.img}/>
                  <Text style={styles.welcomeTxt} >
                        Welcome to Dopplle
                  </Text>
                  <Text style={styles.createLoginTxtInput} >
                        Login to see it in action
                  </Text>
                  <View  style={styles.inputBox}>
                    <TextInput
                      style={{fontSize:20}}
                      placeholder="User email"
                      underlineColorAndroid = "transparent"
                      onChangeText = {this.handleEmail}
                      onBlur = {this.emailVaidate}
                      ref={email => { this.emailTxt = email }}
                    >
                    </TextInput>
                  </View>
                  <View  style={styles.inputBox}>
                    <TextInput
                        style={{fontSize:20}}
                        placeholder="Password"
                        underlineColorAndroid = "transparent"
                        textContentType="password"
                        secureTextEntry={true}
                        onChangeText = {this.handlePassword}
                        ref={password => { this.passwordTxt = password }}
                    >
                    </TextInput>
                  </View>
                  <TouchableHighlight 
                        style={styles.loginButton}
                        onPress={this.handleLogin}
                      >
                      <Text style={styles.loginTxt}>
                          Log In
                      </Text>
                  </TouchableHighlight>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleSigninButton
                      style={{ width: 48, height: 48, marginTop: 15 }}
                      size={GoogleSigninButton.Size.Icon}
                      color={GoogleSigninButton.Color.Dark}
                      onPress={this._signIn}
                      disabled={this.state.isSigninInProgress} />
                    <TouchableOpacity style={{
                      borderColor: '#007aff',
                      marginTop: 16, marginLeft: 15,
                      borderWidth: 1,
                      width: 41,
                      height: 41,
                      borderRadius: 3,
                      shadowOpacity: 0.1,
                      shadowOffset: { height: 10, width: 10 },
                      elevation: 3,
                    }} onPress={this._fbAuth}>
                      <Image source={FBLogin} style={{ width: 39, height: 39, marginRight: 10 }} />
                    </TouchableOpacity>
                  </View>
                  <Text 
                    style={styles.forgotTxtInput}
                    onPress ={this.handleForgot}  
                  >
                        Forgot password?
                  </Text>
                  <Text 
                    style={styles.createTxt} 
                    onPress={this.handleGoRegister}
                  >
                        Create an account
                  </Text>
                  <ModalComponent visible ={this.state.modalVisible} toggleModal={this.toggleModal}  txt="Login was succssfully"/>
                  
                   {/* <LoginButton ></LoginButton> */}
                  
                </View>
              </ScrollView>
        
      );
    }
  }
  
  const styles = StyleSheet.create({

        container:{
          flex: 1,
          flexDirection:"column",
          justifyContent:"center",
          alignItems:"center"
        },
        img:{
          margin:20,
          width:180,
          height:120,
        },
        welcomeTxt:{
          fontSize:30,
          color:"#797c7e",
          textAlign:"center"
        },
        inputBox:{
          width:screenWidth/1.3,
          height:45,
          backgroundColor:"#fff",
          borderRadius:10,
          marginTop:20,
          paddingLeft:10,
          borderBottomColor:"#797c7e",
          borderBottomWidth:1
        
        },
      
        loginButton:{
          backgroundColor:"#f26727",
          width:screenWidth/1.3,
          borderRadius:6,
          height:50,
          justifyContent:"center",
          marginLeft:10,
          marginRight:10,
          marginTop:30,
        },
        loginTxt:{
          textAlign:"center",
          color:"#fff",
          fontSize:18,
        },
        createLoginTxtInput:{
          fontSize:18,
          color:"#797c7e",
          textAlign:"center",
          marginTop:10,
          marginBottom:10,
          paddingBottom:10,
        },
        createTxt:{
          fontSize:18,
          color:"#797c7e",
          textAlign:"center",
          marginTop:20,
          marginBottom:30,
          paddingBottom:20,
        },
        forgotTxtInput:{
          fontSize:18,
          color:"#6397c5",
          textAlign:"center",
          marginTop:15
        }

    });