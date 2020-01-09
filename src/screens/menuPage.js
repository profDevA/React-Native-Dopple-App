
'use strict';

import React from 'react';
import {   StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
 } from 'react-native';
import { Spinner } from 'native-base'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export default class MenuPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            mailvalidate:false,
            modalVisible: false,
            googlefacebook:'',
            userId:'',
            name:'',
            loading:false,
            mailPssword:false,
        };
      
    }

  componentDidMount = async()=>{
    console.log(screenHeight)

    var userId = await AsyncStorage.getItem('userId')
    var googlefacebook = await AsyncStorage.getItem('googlefacebook')
    if(googlefacebook == 'Email')
    {
      this.setState({mailPssword:true})
    }
     console.log(googlefacebook)
    this.setState({googlefacebook:googlefacebook})
   
    this.setState({userId:userId,loading:true})
    
    fetch('http://dopplle.net/Apiuser/user?'+'userId'+'='+ userId, {
      method: 'GET',
      }).then((response) => response.json())
            .then(async(responseJson) => {
              console.log(responseJson);
              this.setState({loading:false})
            
               await this.setState({name : responseJson[0].name,loading:false}) ;
                
              
            })
  }
  


  handleGoProfile = () =>{
    this.props.navigation.navigate('Profile')
   
  }

  handleGoMeasurment = () =>{
    this.props.navigation.navigate('Group')
  }

  resetPassword= () =>{
    this.props.navigation.navigate('Reset')
   
  }

    render() {
      const {googlefacebook,name,loading,mailPssword} =  this.state
      return (
       
                <View style={styles.container}>
                  {loading && (
                   <Spinner
                      style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                      color='#cb9a34' />
                  )}
                  {!loading && (
                  <View style={styles.container}>
                  <Image source={require('../Resources/logo.png')} style={styles.img}/>
                  
                    <View ><Text style={{textAlign:"center",color:"#797c7e",fontSize:25,marginTop:20}}>{name} logged in by {googlefacebook}.</Text></View>
                 
                  
                  <View style={styles.subcontainer} >
                    <View  >
                      <TouchableOpacity 
                        style={styles.proMesurBox} 
                        onPress={this.handleGoProfile}
                        >
                        <Image source={require('../Resources/profile1.png')} style={styles.subimg}/>
                        <Text 
                          style={styles.proMeasureTxt}
                          
                        >
                          Setting the Profile
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity 
                        style={styles.proMesurBox} 
                        onPress={this.handleGoMeasurment}
                      >
                        <Image source={require('../Resources/measure.png')} style={styles.subimg}/>
                        <Text 
                          style={styles.proMeasureTxt}
                         
                        >
                            Measurement Unit
                        </Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                  {mailPssword && (  
                  <View >
                      <TouchableOpacity 
                        style={styles.proMesurBox} 
                        onPress={this.resetPassword}
                        >
                        <Image source={require('../Resources/profile1.png')} style={styles.subimg}/>
                        <Text 
                          style={styles.proMeasureTxt}
                          
                        >
                          Reset Password
                        </Text>
                      </TouchableOpacity>
                    </View>
                    )}
                </View>
                 )}
              </View>
        
      );
    }
  }
  
  const styles = StyleSheet.create({

        container:{
          flex: 1,
          flexDirection:"column",
          // justifyContent:"center",
          alignItems:"center"
        },
        img:{
          marginTop:60,
          width:180,
          height:120,
        },
        subcontainer:{
          flexDirection:"row",
          justifyContent:"space-between"
        },
        proMesurBox:{
          width:110,
          height:110,
          backgroundColor:"#f90",
          alignItems:"center",
          borderRadius:10,
          margin:20
        },
       subimg:{
         width:60,
         height:60,
         marginTop:6
        },
        proMeasureTxt:{
          color:"#fff",
          textAlign:"center"
        }

    });