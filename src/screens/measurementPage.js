import React from "react";
import { View,Image,ImageBackground,Dimensions,TextInput } from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class MeasurementPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
       
       
     
    };
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

  componentDidMount(){
  }

  render() {

    return (
        <Container>
            <ImageBackground
                resizeMode={'contain'}
                style={{height:screenHeight,marginBottom:30}}
                source={require('../Resources/body.jpg')}
            > 
                <Content style={{ marginBottom:20}}>
                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                       <Text 
                            style={{width:300,height:80,backgroundColor:"transparent",marginTop:screenHeight/6.5}}
                            onPress={this.handleHeight}
                        >
                        </Text>
                        <Text 
                            style={{width:300,height:80,backgroundColor:"transparent",marginTop:screenHeight/6}}
                            onPress={this.handleWaist}
                        >
                        </Text>
                        <Text 
                            style={{width:300,height:80,backgroundColor:"transparent",marginTop:screenHeight/7}}
                            onPress={this.handleLeg}
                        >
                        </Text>
                    </View>
                    
                </Content>
            </ImageBackground>
           
        </Container>
    );
  }
}

