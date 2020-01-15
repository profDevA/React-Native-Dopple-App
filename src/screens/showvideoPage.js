
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
import YouTube from 'react-native-youtube'
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export default class ShowvideoPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading:false,
            videoPath:''
        };
      
    }

   
  componentDidMount = async()=>{
    this.setState({loading:true})
    this.setState({videoPath:this.props.navigation.getParam('videoPath','../Resources/leg.mp4')})
    console.log('component didmount')
  }
  
  onLoad = (e)=>{
    this.setState({loading:false})
    console.log(e, 'loading==================================')
  }

  onEnd = ()=>{
      this.props.navigation.pop()
  }

  onBuffer =()=> {
    console.log(e, 'on buffering')
  }

  onError =(e)=>{
    console.log(e, 'error getting')
  }

  onLoadStart =(e)=>{
    console.log(e, 'onload start')
  }
  

    render() {
      console.log('-----------------------renderstart---------------------')
      const {loading} =  this.state
      return (
        <View style={{marginTop:50,justifyContent:"center",alignItems:"center"}}>
        {loading && (
            <Spinner
              style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
              color='#cb9a34' />
          )}
            <Image source={require('../Resources/logo.png')} style={{height:140,width:140}}/>
            
              {/* <Video source={require('../Resources/leg.mp4')}   // Can be a URL or a localfile.
                ref={(ref) => {
                    this.player = ref
                }}    
                controls={true}
                resizeMode="contain"                                  // Store reference
                onBuffer={(e)=>this.onBuffer(e)}                // Callback when remote video is buffering
                onLoad={(e)=>this.onLoad(e)}    
                onEnd={this.onEnd}                      // Callback when playback finishes
                onError={(e)=>this.onError(e)}  
                style={{width:screenWidth,height:300,}} 
                
                /> */}
                <YouTube
                  apiKey={'AIzaSyDkl929FBlKD1IDPhTKc0VA2Y4dF8AX5VU'}
                  videoId={this.state.videoPath} // The YouTube video ID
                  play = {true} // control playback of video with true/false
                  onReady={e => console.log(e, "Ready To Play!!!")}
                  onChangeState={e => console.log(e.state, "state changed---------")}
                  onChangeQuality={e => console.log(e.quality, "quality is this")}
                  onError={e => console.log(e.error, "Error getting")}
                  // style={{ alignSelf: 'stretch', height: 300, marginTop:50 }}
                  style={{width:screenWidth,height:300,marginTop:30}} 
                />
        </View>
              
      );
    }
  }
  
