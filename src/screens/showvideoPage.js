
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
const screenHeight = Math.round(Dimensions.get('window').height);
export default class ShowvideoPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading:false
        };
      
    }

  componentDidMount = async()=>{
    this.setState({loading:true})

  }
  
  onLoad = ()=>{
    this.setState({loading:false})
  }

  onEnd = ()=>{
      this.props.navigation.pop()
  }
  

    render() {
      const {loading} =  this.state
      return (
                <View style={{marginTop:50,justifyContent:"center",alignItems:"center"}}>
                {loading && (
                   <Spinner
                      style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                      color='#cb9a34' />
                  )}
                    <Image source={require('../Resources/logo.png')} style={{height:140,width:140}}/>
                   
                     <Video source={require('../Resources/leg.mp4')}   // Can be a URL or a localfile.
                        ref={(ref) => {
                            this.player = ref
                        }}    
                        resizeMode="contain"                                  // Store reference
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onLoad={this.onLoad}    
                        onEnd={this.onEnd}                      // Callback when playback finishes
                        onError={this.videoError}               // Callback when video cannot be loaded
                        style={{width:screenWidth,height:300}} />
                </View>
      );
    }
  }
  
