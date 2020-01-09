
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
import Video from 'react-native-video';
const screenWidth = Math.round(Dimensions.get('window').width);

export default class GroupPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
  
        };
      
    }

  componentDidMount = async()=>{
    
  }
  


 

  handleGoMeasurment = () =>{
    this.props.navigation.navigate('Measurement')
  }

  

    render() {
      const {} =  this.state
      return (
                <View style={{marginTop:50,justifyContent:"center",alignItems:"center"}}>
                    <Image source={require('../Resources/logo.png')} style={{height:140,width:140}}/>

                    <View style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}>
                        <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>Torso</Text>
                    </View>
                    <View style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}>
                        <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>Legs</Text>
                    </View>
                    <View 
                        style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}
                        onStartShouldSetResponder={()=>this.props.navigation.navigate('Measurement')}
                    >
                        <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>Add Measurements</Text>
                    </View>
                    <View style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}>
                        <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>Fitted T-Shirts</Text>
                    </View>

                    
                </View>
      );
    }
  }
  
