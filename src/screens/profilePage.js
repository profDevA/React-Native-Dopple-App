
'use strict';

import React from 'react';
import {   StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  ScrollView,
  AsyncStorage,
  TouchableHighlight,Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker'
import { Container,Picker,Item} from 'native-base'
import RNPickerSelect from 'react-native-picker-select';
import RNFetchBlob from 'react-native-fetch-blob'
import ImgToBase64 from 'react-native-image-base64'
import RNFS from 'react-native-fs'
import  ModalComponent  from '../component/modalComponent'
import ImageResizer from 'react-native-image-resizer'
import { Spinner } from 'native-base'
const screenWidth = Math.round(Dimensions.get('window').width);
import { LoginManager,LoginButton,AccessToken,GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import { GoogleSignin,GoogleSigninButton } from 'react-native-google-signin';
import { toastr } from '../component/toastComponent';

export default class ProfilePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            userId:'',
            firstname:'',
            lastname:'',
            name:'',
            email:'',
            contactNumber:'',
            address1:'',
            address2:'',
            city:'',
            country:'',
            preference:'',
            photo:'',
            url:null,
            modalVisible:false,
            loading:false,
            ggfbshow:false,
            mailshow:false,
            
        };
      
    }

   async  componentDidMount()
    {
      console.log("----------")
      var userId = await AsyncStorage.getItem('userId')
      var ggfbshow = await AsyncStorage.getItem('googlefacebook')
      if(ggfbshow == 'Google')
      {
        this.setState({ggfbshow:true})
      }
      else if(ggfbshow == 'Facebook'){
        this.setState({ggfbshow:false})
      } else{
        this.setState({mailshow:true})
      }

      this.setState({userId:userId,loading:true})
      
      fetch('http://dopplle.net/Apiuser/user?'+'userId'+'='+ userId, {
        method: 'GET',
        }).then((response) => response.json())
              .then((responseJson) => {
                console.log(responseJson);
                this.setState({loading:false})
                if(responseJson[1].base64img!="")
                {
                  this.setState({url : responseJson[1].base64img}) ;
                }
                this.setState({firstname:responseJson[0].firstname})
                this.setState({lastname:responseJson[0].lastname})
                this.setState({name:responseJson[0].name})
                this.setState({email:responseJson[0].email})
         
                if(responseJson[0].mobile!=0)
                {
                  this.setState({contactNumber:responseJson[0].mobile})
                }
                if(responseJson[0].address1!="-")
                {
                  this.setState({address1:responseJson[0].address1})
                }
                if(responseJson[0].address2!="-")
                {
                  this.setState({address2:responseJson[0].address2})
                }
                if(responseJson[0].city!="-")
                {
                  this.setState({city:responseJson[0].city})
                }
                if(responseJson[0].country!="-")
                {
                  this.setState({country:responseJson[0].country})
                }
                if(responseJson[0].preference!="-")
                {
                  this.setState({preference:responseJson[0].preference})
                }
              
              })
              .catch((error) => {
                console.log(error);
                this.setState({loading:false})
        });

    }

    toggleModal = () =>{
      this.setState({modalVisible:false})
      this.props.navigation.navigate('Menu')
   
    }

    handleFirstName = (text) => {
      this.setState({ firstname: text })
    }
    handleLastName = (text) => {
      this.setState({ lastname: text })
    }

    handleEmail = (text) => {
      this.setState({ email: text })
    }

    handleUsername = (text) => {
      this.setState({ name: text })
    }

    handleContactNumber = (text) => {
      this.setState({ contactNumber: text })
    }

    handleAddressLine1 = (text) => {
      this.setState({ address1: text })
    }

    handleAddressLine2 =  (text) => {
      this.setState({ address2: text })
    }

    handleCity =  (text) => {
      this.setState({ city: text })
    }

    handleCountry = (text) => {
      this.setState({ country: text })
    }
    handleContactPreference = (text) =>{
      this.setState({preference:text})
    }

    handleprofile =() =>{
      const{userId,photo,firstname,lastname,email,name,contactNumber,address1,address2,city,country,preference} =  this.state
      this.setState({loading:true})
      // fetch('http://192.168.207.11/backendCI/Apiuser/user/'+ userId, {
      fetch('http://dopplle.net/Apiuser/user/'+ userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          
        },
        body:'firstname'+'='+firstname+'&'+ 'lastname'+'='+lastname+'&'+ 'email'+'='+ email+'&'+ 'name'+'='+ name+'&'+'photo'+'='+ photo+'&'+'contactNumber'+'='+ contactNumber+'&'+'address1'+'='+ address1+'&'+'address2'+'='+ address2+'&'+'city'+'='+ city+'&'+'country'+'='+ country+'&'+'preference'+'='+ preference+'&'+'getting'+'='+ "yes"
    
        }).then((response) => response.json())
              .then((responseJson) => {
                console.log("photo",responseJson); 
                this.setState({loading:false})  
                this.setState({modalVisible:true})            
              })
              .catch((error) => {
                this.setState({loading:false})
                console.log(error);
        });
    }

    handleremovingPhoto = async () =>{
      await  this.setState({photo:"",url:null})
      const{userId,photo,firstname,lastname,email,name,contactNumber,address1,address2,city,country,preference} =  this.state
      // fetch('http://192.168.207.11/backendCI/Apiuser/user/'+ userId, {
      fetch('http://dopplle.net/Apiuser/user/'+ userId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          
        },
        body:'firstname'+'='+firstname+'&'+ 'lastname'+'='+lastname+'&'+ 'email'+'='+ email+'&'+ 'name'+'='+ name+'&'+'photo'+'='+ photo+'&'+'contactNumber'+'='+ contactNumber+'&'+'address1'+'='+ address1+'&'+'address2'+'='+ address2+'&'+'city'+'='+ city+'&'+'country'+'='+ country+'&'+'preference'+'='+ preference+'&'+'getting'+'='+ "no"
    
        }).then((response) => response.json())
              .then((responseJson) => {

              })
              .catch((error) => {
                console.error(error);
        });
    }

    handleLogout =  async ()=>{
    
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.error(error);
      }
     await this.props.navigation.navigate('Home')
    }


    handleFacebookLogout = () =>{
      var current_access_token = '';
        this.setState({loading:true})
        AccessToken.getCurrentAccessToken().then((data) => {
          current_access_token = data.accessToken.toString();
        }).then(() => {
          let logout =  new GraphRequest(
            "me/permissions/",
            {
                accessToken: current_access_token,
                httpMethod: 'DELETE'
            },
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + error.toString());
                    this.setState({loading:false})
                    
                } else {
                    LoginManager.logOut();
                    this.props.navigation.navigate('Home')
                    this.setState({loading:false})
                }
            });
          new GraphRequestManager().addRequest(logout).start();
        })
        .catch(error => {
          console.log(error)
          this.setState({loading:false})
        });      
    }

    handleChoosePhoto=()=>{
      if (Platform.OS == 'android'){
        const options = {
          noData: true,
        }
        ImagePicker.showImagePicker(options, response => {
          if (response.uri) {
            this.setState({url:response.uri })
            console.log(response)
 
            ImgToBase64.getBase64String(response.uri)
              .then(base64String => {
                this.setState({photo:base64String})
                this.setState({url:base64String})

              })
              .catch(err => console.error(err));

           
          
          }
        })

      } else{
        const options = {
          noData: true,
        }
        ImagePicker.showImagePicker(options, response => {
          if (response.uri) {
            ImageResizer.createResizedImage(response.uri,80,60,'JPEG',100)
            .then(({uri})=>{
              console.log(uri)
              // this.setState({url:uri })
              RNFetchBlob.config({
                fileCache: true
              })
                .fetch("GET", uri)
                // the image is now dowloaded to device's storage
                .then(resp => {
                  // the image path you can use it directly with Image component
                  // imagePath = resp.path();
                  return resp.readFile("base64");
                })
                .then(base64Data => {
                  // here's base64 encoded image
            
                  this.setState({url:base64Data})
                  console.log(base64Data)
                  this.setState({photo:base64Data})
                  // remove the file from storage
                  // return fs.unlink(response.uri);
                });

            })
            .catch(err=>{
              console.log(err);
            })     
          }
        })
      }
    }
    render() {
     
      const{url,firstname,lastname,email,name,contactNumber,address1,address2,city,country,preference,loading,ggfbshow,mailshow} =  this.state
      
      return (
        <Container >
            <ScrollView >
                <View style={styles.container}>
                  {loading && (
                      <Spinner
                        style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                        color='#f26727' />
                   )}
                    <Text style={styles.welcomeTxt} >
                            User Profile
                    </Text>
                    {url && (
                         <Image source={{uri: `data:image/jpeg;base64,${url}`}} style={{margin:10,width:80,height:80,marginBottom:10,}} />

                    )}

                    {!url && (
                        <Image 
                            source={require('../Resources/logo.png')} 
                            style={{margin:10,width:80,height:80,marginBottom:10,}}
                        />

                    )}
                   <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}} >
                    <View  style={{backgroundColor:"#f26727",padding:10,borderRadius:5,marginRight:10}} >
                    
                        <Text 
                            onPress={this.handleChoosePhoto}
                            style={{color:"#fff",fontSize:16}}
                        >
                            Getting photo
                        </Text>
                    </View>
                    <View  style={{backgroundColor:"#f26727",padding:10,borderRadius:5,marginLeft:10}} >
                    
                        <Text 
                            onPress={this.handleremovingPhoto}
                            style={{color:"#fff",fontSize:16}}
                        >
                           Removing photo
                        </Text>
                    </View>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="First Name"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleFirstName}
                        value={firstname}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="Last Name"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleLastName}
                        value={lastname}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="Email Address"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleEmail}
                        value={email}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="UserName"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleUsername}
                        value={name}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                          style={{fontSize:20}}
                          placeholder="Contact Number"
                          underlineColorAndroid = "transparent"
                          keyboardType={'numeric'}
                          onChangeText = {this.handleContactNumber}
                          value={contactNumber}
                          // ref={password => { this.passwordText = password }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="AddressLine1"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleAddressLine1}
                        value={address1}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="AddressLine2"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleAddressLine2}
                        value={address2}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="City"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleCity}
                        value={city}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="Country"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleCountry}
                        value={country}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View  style={styles.inputBox}>
                      <TextInput
                        style={{fontSize:20}}
                        placeholder="Contact Preference"
                        underlineColorAndroid = "transparent"
                        onChangeText = {this.handleContactPreference}
                        value={preference}
                        // ref={eMail => { this.eMailText = eMail }}
                      >
                      </TextInput>
                    </View>
                    <View style={styles.inputBox}>
                    <RNPickerSelect
                        onValueChange={(value) => this.setState({preference:value})}
                        items={[
                            { label: 'email', value: 'email' },
                            { label: 'phone', value: 'phone' },
                           
                        ]}
                    />
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                      <TouchableHighlight 
                              style={styles.loginButton}
                              onPress={this.handleprofile}
                          >
                          <Text style={styles.loginTxt}>
                              Save
                          </Text>
                      </TouchableHighlight>
                      {mailshow ? 
                        (<View>
                          <TouchableHighlight 
                              style={styles.loginButton}
                              onPress={() => this.props.navigation.navigate('Home')}
                            >
                            <Text style={styles.loginTxt}>
                              Mail Logout
                            </Text>
                        </TouchableHighlight>
                        </View>) 
                        :
                        (<View>
                          { ggfbshow ? (
                           <TouchableHighlight 
                              style={styles.loginButton}
                              onPress={this.handleLogout}
                            >
                            <Text style={styles.loginTxt}>
                              Google Logout
                            </Text>
                        </TouchableHighlight>
                      ):(
                        // <LoginButton  style={styles.loginButton} onLogoutFinished={() => this.props.navigation.navigate('Home')}></LoginButton>
                        <TouchableHighlight 
                          style={styles.loginButton}
                          onPress={this.handleFacebookLogout}
                            >
                            <Text style={styles.loginTxt}>
                              Facebook Logout
                              </Text>
                          </TouchableHighlight>
                        )}
                        </View>)
                      }

                      
                     
                     
                    </View>
                    <ModalComponent visible ={this.state.modalVisible} toggleModal={this.toggleModal}  txt="Profile Information was saved successfully"/>
                </View>
            </ScrollView>
        </Container>        
    
        
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
          textAlign:"center",
          fontWeight:'bold',
          marginTop:30,
        },
        inputBox:{
          width:screenWidth/1.1,
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
          width:screenWidth/2.4,
          borderRadius:6,
          height:50,
          justifyContent:"center",
          marginLeft:3,
          marginRight:3,
          marginTop:30,
          marginBottom:30,
          alignItems:"center",
          fontSize:16,
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
          marginTop:25,
        },
        forgotTxtInput:{
          fontSize:18,
          color:"#6397c5",
          textAlign:"center",
          marginTop:25
        }

    });