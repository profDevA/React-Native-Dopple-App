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
          userId:'',
          measurementGroup:[],
        };
      
    }

    componentDidMount = async()=>{
      var userId = await AsyncStorage.getItem('userId')
  
      // var userId = '34'
      this.setState({userId:userId,loading:true})
  
        // fetch('http://192.168.207.54:7002/Apimeasurement/measurementGroup', {
        fetch('http://dopplle.net/Apimeasurement/measurementGroup', {
            method: 'GET',
            }).then((response) => response.json())
            .then(async(responseJson) => {
              this.setState({measurementGroup:responseJson})
              // console.log(this.state.measurementGroup)
            })
            .catch((err)=>{
                console.log("--------------",err)
            }) 
                            
    }

  handleGoMeasurment = (data) =>{
    this.props.navigation.navigate(
      'Measurement', 
      {
        MeasurementGroupID :data.MeasurementGroupID,
        mGroupDescription  :data.GroupDescription,
        mGroupComment : data.Comments,
        FemaleGroupImageURL:data.FemaleGroupImageURL,
        MaleGroupImageURL :data.MaleGroupImageURL
      })
  }

    render() {
      const {measurementGroup} =  this.state
      return (
                <View style={{marginTop:50,justifyContent:"center",alignItems:"center"}}>
                    <Image source={require('../Resources/logo.png')} style={{height:140,width:140}}/>

                    {
                      measurementGroup && measurementGroup.length>0 &&
                      measurementGroup.map((data)=>{
                        return(
                          <View style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}
                                onStartShouldSetResponder={()=>this.handleGoMeasurment(data)}
                          >
                              <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>{data.GroupDescription}</Text>
                          </View>
                        )
                      })
                    }

                    {/* <View 
                        style={{height:45,width:screenWidth/1.2, backgroundColor:"#f90",justifyContent:"center",borderRadius:6,marginTop:20}}
                        onStartShouldSetResponder={()=>this.props.navigation.navigate('Measurement')}
                    >
                        <Text style={{color:"white",textAlign:"center",fontWeight:"bold",fontSize:20,}}>Add Measurements</Text>
                    </View> */}
                    
                </View>
      );
    }
  }
  
