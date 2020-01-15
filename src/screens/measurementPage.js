import React from "react";
import { View,Image,ImageBackground,Dimensions,TextInput, AsyncStorage,StyleSheet, TouchableHighlight } from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, Card, ListItem, Thumbnail, List ,Spinner} from "native-base";
import { database } from "react-native-firebase";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class MeasurementPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
       userId:'',
       iconPos:[],
       imgHeight:0,
       imgWidth:0,
       backImageUrl:'https://dopplle.com/uploads/app/images/measurement_specific/woman.jpg'
    };
  }

 
  async componentDidMount(){
    var userId = await AsyncStorage.getItem('userId')
    this.setState({userId:userId,loading:true})
    this.setState({backImageUrl:this.props.navigation.getParam('FemaleGroupImageURL','https://dopplle.com/uploads/app/images/measurement_specific/woman.jpg')}) //Get background Image URL

    let mGroupId = await this.props.navigation.getParam('MeasurementGroupID','') 

    //Get Measurement Group Icon Postion
    // await fetch(`http://192.168.207.54:7002/Apimeasurement/mGroupIconInfo?MeasurementGroupID=${encodeURIComponent(mGroupId)}`, {
      await fetch(`http://dopplle.net/Apimeasurement/mGroupIconInfo?MeasurementGroupID=${encodeURIComponent(mGroupId)}`, {
          method: 'GET',
          headers: {
            'Accept':'application/json',
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())
        .then(async(responseJson) => {
          this.setState({iconPos:responseJson})
        })
        .catch((err)=>{
            console.log("--------------",err)
        }) 
                      
  }


  handleHeight=()=>{
    this.props.navigation.push('Height')
  }

  handleWaist =()=>{
      this.props.navigation.push('Waist')
  }

  handleLeg=()=>{
    this.props.navigation.push('Leg')
  }

  handleArm=()=>{
    console.log('this is arm button')

    this.props.navigation.push('Arm')
  }

  handleMeasure =(data)=> {
    if (data.comments==='Height') {
      this.handleHeight()
    } else if(data.comments ==='Waist') {
      this.handleWaist()
    } else if (data.comments === 'Inside Leg') {
      this.handleLeg()
    } else if (data.comments === 'Torso arm length') {
      this.handleArm()
    }
  }

  onLayout = async (event) => {
    let imgRatio = 0.4
    Image.getSize(this.state.backImageUrl, (width, height) => {
      imgRatio = Math.round((width/height) * 100) / 100
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });
    
    let {
      x,
      y,
      width,
      height
    } = event.nativeEvent.layout;
     height = Math.round(height * 100) / 100
     width = Math.round(height * imgRatio * 100) / 100

    await this.setState({imgHeight:height, imgWidth:width})
  }

  render() {
    const gDescription = this.props.navigation.getParam('mGroupDescription','No Description!')
    const gComment = this.props.navigation.getParam('mGroupComment','')

    const {backImageUrl} = this.state

    let touchableStyleObj = {}

    return (
        <Container style={{ borderColor:'black',flex:1,marginTop:15}}>
            <View style={{flex:1}}>
              <Text style={{fontSize:25, textAlign:'center' }}>
                {gDescription}
              </Text>
              {
                gDescription==='Add Measurement'?
                <Text style={{fontSize:16, textAlign:'center', marginTop:5}}>
               {gComment} &nbsp;Height, Waist and Legs
              </Text>:
              <Text style={{fontSize:16, textAlign:'center', marginTop:5}}>
              {gComment}
             </Text>
              }
              
            </View>
            <View style={{flex:6,justifyContent:'center'}} onLayout={this.onLayout}>
                <View style={{height:this.state.imgHeight,width:this.state.imgWidth,alignSelf:'center'}}>
                <Image
                  resizeMode={'contain'}
                  style={{borderColor:'green',height:'100%'}}
                  source={{uri:backImageUrl}}
                  // source={require('../Resources/body.jpg')}
              > 
              </Image>
                  {
                    this.state.iconPos&&this.state.iconPos.length>0&&
                    this.state.iconPos.map((data)=>{
                      let touchableStyle = {width:50, height:50, justifyContent:'center', alignItems:'center',
                                                transform: [
                                                  {translateX:-25},
                                                  {translateY:-25} 
                                                ],
                                                position:'absolute',
                                                top:'70%',
                                                left:'58%',
                                            }
                        touchableStyle.top = data.icon_y_percent+'%'
                        touchableStyle.left = data.icon_x_percent+'%'
                        let touchabeStyleItem = data.comments.replace(/ /g, '-').toLowerCase()
                        touchableStyleObj[touchabeStyleItem] = touchableStyle
                        const styles = StyleSheet.create(touchableStyleObj)
                      return (
                          <TouchableHighlight 
                            onPress={()=>this.handleMeasure(data)} 
                            style={styles[touchabeStyleItem]}
                            >
                              <Text style={{fontSize:30,
                                            color:'#ffffff',
                                            fontWeight:'bold',
                                            textAlign:'center', 
                                            backgroundColor:'gray', 
                                            width:30, height:30, 
                                            borderRadius:15, 
                                            marginTop:0,
                                            lineHeight:32,
                                            textAlignVertical:'center',
                                            }}
                                    
                              >
                                  +
                              </Text>
                          </TouchableHighlight>
                      )
                    })
                  }
                </View>
            </View>
        </Container>
    );
  }
}

