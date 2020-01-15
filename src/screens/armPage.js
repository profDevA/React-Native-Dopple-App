import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableHighlight,StyleSheet,AsyncStorage } from "react-native";

import { Container, Title, Left, Icon, Right, Button, Body, Content,Text, ListItem, Thumbnail, List ,Spinner} from "native-base";
import { inc } from "semver";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
var convert = require('convert-units')

export default class ArmPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
       ftstate:false,
       cmstate:false,
       inchstate:false,
       defaultUnitState:'cm',
       loading:false,
       ft:1,
       inch:8,
       indivdualInch:20,
       cm:50,
       userId:'',
       armLength:500,
       checkedFirst:'',
       leg:0,
       waist:0,

       Description:'',
       Comments:'',
       FemaleGroupImageURFemaleMeasurementImageURL:'',
       SubHeading:'',
       SubText:'',
       Videopath:'',
    };
  }

  componentDidMount = async()=>{
    var userId = await AsyncStorage.getItem('userId')
   

    // var userId = '34'
    this.setState({userId:userId,loading:true})
 

            // fetch('http://192.168.207.54:7002/Apimeasurement/measurement?measurementId= 1', {
            await fetch('http://dopplle.net/Apimeasurement/measurement?measurementId= 4', {
                method: 'GET',
                }).then((response) => response.json())
                .then(async(responseJson) => {
                    console.log(responseJson[0],'responsejson0')    
                    this.setState({Description:responseJson[0].Description})
                    this.setState({Comments:responseJson[0].Comments})
                    this.setState({FemaleGroupImageURFemaleMeasurementImageURL:responseJson[0].FemaleGroupImageURFemaleMeasurementImageURL})
                    this.setState({SubHeading:responseJson[0].SubHeading})
                    this.setState({SubText:responseJson[0].SubText})
                    this.setState({Videopath:responseJson[0].Videopath})
                    

                    var tempArmLength = parseInt(responseJson[0].DefaultValueMM)
                    var tempInch = Math.round(convert(tempArmLength).from('mm').to('in'))
                    var quotient = Math.floor(tempInch/12);
                    var remainder = tempInch % 12;
                    await  this.setState({ft:quotient,inch:remainder})
                    await this.setState({cm:tempArmLength/10,indivdualInch:tempInch})
                    await this.setState({armLength:tempArmLength})

                    if(responseJson[0].UnitName) {
                        console.log(this.state.defaultUnitState, 'default unit state')
                        this.setState({defaultUnitState:responseJson[0].UnitName})
                    }
                
                })
                .catch((err)=>{
                    console.log("--------------",err)
                })

            // fetch('http://192.168.207.54:7002/Apimeasurement/measurement', {
                await fetch('http://dopplle.net/Apimeasurement/measurement?', {
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body:'UserID'+'='+userId+'&'+ 'MeasurementID'+'='+ '4'+'&'+ 'type'+'='+ 'read'
                }).then(async(response) => response.json())
                
                        .then(async(responseJson) => {
                            console.log(responseJson, 'responseJson this is response json 2222222')
                         this.setState({loading:false})   
                        if(responseJson ===undefined || responseJson.length ===0)
                        {
                            this.setState({checkedFirst:"yes"})
                            if(this.state.defaultUnitState==='Feet Inches')
                            {
                                this.setState({ftstate:true})
                            }
                            if(this.state.defaultUnitState==='cm')
                            {
                                this.setState({cmstate:true})
                            }
                            if(this.state.defaultUnitState==='Inches')
                            {
                                this.setState({inchstate:true})
                            }
                        }
                        else{
                            await this.setState({checkedFirst:"no"})
                            var tempArmLength = parseInt(responseJson[0].ValueMM)
                            var tempInch = Math.round(convert(tempArmLength).from('mm').to('in'))
                            var quotient = Math.floor(tempInch/12);
                            var remainder = tempInch % 12;
                            await this.setState({ft:quotient,inch:remainder})
                            await this.setState({cm:tempArmLength/10,indivdualInch:tempInch})
                            await this.setState({armLength:tempArmLength})
    
                            if(responseJson[0].MeasureUnitID==='3')
                            {
                                
                                await this.setState({ftstate:true,cmstate:false,inchstate:false})
                            }
                            if(responseJson[0].MeasureUnitID==='1')
                            {
                             
                                await this.setState({cmstate:true,ftstate:false,inchstate:false})
                            }
                            if(responseJson[0].MeasureUnitID==="2")
                            {
                               
                                await this.setState({inchstate:true,ftstate:false,cmstate:false})
                            }
                            // this.setState({loading:false})
                            // setTimeout(() => {
                            // this.props.navigation.pop()
                            // }, 1500);
                            
                        } 
                });    
  }




  handleFtInMinus=()=>{
        this.setState(prevState => ({ inch: prevState.inch - 1 }))
        if(this.state.inch==0){
            this.setState(prevState => ({ ft: prevState.ft - 1 }))
            this.setState({inch:11})
        }
        this.setState(prevState => ({ indivdualInch: prevState.indivdualInch - 1 }))

        var tempCm = Math.round(convert(this.state.ft*12+this.state.inch-1).from('in').to('cm'))
       this.setState({cm:tempCm})

       this.setState({armLength:tempCm*10})

       console.log(this.state.ft+","+this.state.inch-1)
       console.log(this.state.cm)
    }

    handleFtInPlus =()=>{
        this.setState(prevState => ({ inch: prevState.inch + 1 }))
        if(this.state.inch==11){
            this.setState(prevState => ({ ft: prevState.ft + 1 }))
            this.setState({inch:0})
        }
        this.setState(prevState => ({ indivdualInch: prevState.indivdualInch + 1 }))
        var tempCm = Math.round(convert(this.state.ft*12+this.state.inch+1).from('in').to('cm'))
        this.setState({cm:tempCm})
        this.setState({armLength:tempCm*10})

    }

    handleCmMinus=()=>{
        this.setState(prevState => ({ cm: prevState.cm - 1 }))

        this.setState(prevState => ({ armLength: prevState.armLength - 10 }))

        var tempInch = Math.round(convert(this.state.cm-1).from('cm').to('in'))
        this.setState({indivdualInch:tempInch})

        var quotient = Math.floor(tempInch/12);
        var remainder = tempInch % 12;
        this.setState({ft:quotient,inch:remainder})
    }

    handleCmPlus=()=>{
        this.setState(prevState => ({ cm: prevState.cm + 1 }))

        this.setState(prevState => ({ armLength: prevState.armLength + 10 }))

        var tempInch = Math.round(convert(this.state.cm+1).from('cm').to('in'))
        this.setState({indivdualInch:tempInch})
        var quotient = Math.floor(tempInch/12);
        var remainder = tempInch % 12;
        this.setState({ft:quotient,inch:remainder})
    }

    /**
     *  when  click minus button, INCH is true
     */
    handleInchMinus=()=>{
        this.setState(prevState => ({ inch: prevState.inch - 1 }))
        if(this.state.inch==0){
            this.setState(prevState => ({ ft: prevState.ft - 1 }))
            this.setState({inch:11})
        }
        this.setState(prevState => ({ indivdualInch: prevState.indivdualInch - 1 }))
        var tempCm = Math.round(convert(this.state.indivdualInch-1).from('in').to('cm'))
       this.setState({cm:tempCm})
       this.setState({armLength:tempCm*10})
    }

    handleInchPlus=()=>{
        this.setState(prevState => ({ inch: prevState.inch + 1 }))
        if(this.state.inch==11){
            this.setState(prevState => ({ ft: prevState.ft + 1 }))
            this.setState({inch:0})
        }
        this.setState(prevState => ({ indivdualInch: prevState.indivdualInch + 1 }))
        var tempCm = Math.round(convert(this.state.indivdualInch+1).from('in').to('cm'))
        this.setState({cm:tempCm})
        this.setState({armLength:tempCm*10})
    }
    

    handleFT=()=>{
        this.setState({ftstate:true,cmstate:false,inchstate:false})
    }

    handleCM=()=>{
        this.setState({ftstate:false,cmstate:true,inchstate:false})
    }

    handleIN=()=>{
        this.setState({ftstate:false,cmstate:false,inchstate:true})
    } 
    handleSave=()=>{
        this.setState({loading:true})
        
        const { userId,checkedFirst,armLength,ftstate,cmstate,inchstate } = this.state
        console.log('userId:', userId, "checkedFirst:", checkedFirst, 'armLength:', armLength, 'ftstate:', ftstate, 'cmstate:', cmstate, 'inchstate:', inchstate, 'These are data to be saved..')

        let measureUintId = 0
        if(ftstate===true)
        {
            measureUintId = 3
        }
        if(cmstate===true)
        {
            measureUintId = 1
        }
        if(inchstate===true)
        {
            measureUintId = 2
        }

        // fetch('http://192.168.207.54/Apimeasurement/measurement', {
            fetch('http://dopplle.net/Apimeasurement/measurement?', {
            
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:'checkedFirst'+'='+checkedFirst+'&'+ 'UserID'+'='+userId+'&'+ 'ValueMM'+'='+ armLength+'&'+ 'MeasureUnitID'+'='+ measureUintId+'&'+ 'MeasurementID'+'='+4+'&'+ 'type'+'='+ 'Insertupdate'
          }).then((response) => response.json())
           
                  .then((responseJson) => {
                   console.log(responseJson)
                   
                   setTimeout(() => {
                    this.setState({loading:false})
                    this.props.navigation.pop()
                    }, 1500);
                   
            });
            

            
    }
    handleClear=()=>{
        this.setState({ ft:1,
                        inch:8,
                        indivdualInch:20,
                        cm:50,
                        armLength:500,
                     })
    }

    render() {
   const {ftstate,cmstate,inchstate,inch,ft,indivdualInch,cm,loading ,Description,Comments,FemaleGroupImageURFemaleMeasurementImageURL,SubHeading,SubText} =  this.state
   
   console.log(ft, cm, inch)
   console.log(ftstate, 'ftstate', cmstate, 'cmstate', inchstate, 'inchstate')


    return (
        <ScrollView>
            {loading && (
                   <Spinner
                      style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                      color='#cb9a34' />
                  )}
            {!loading && (      
            <View style={{marginLeft:10,marginRight:10,marginTop:30}}>
                <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{color:"#6b6b6b",fontSize:32,fontWeight:"bold"}}>{Description}</Text>
                    <Text style={{color:"#6b6b6b",fontSize:16,fontWeight:"bold"}}>{Comments}</Text>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <View style={{width:screenWidth/2.1,marginLeft:20}}>
                        <Text 
                            style={{width:120,marginTop:40, marginLeft:5, color:"#6b6b6b",fontWeight:"bold",fontSize:21}}
                        >{SubHeading}
                        </Text>
                        <Text 
                            style={{width:120,marginTop:10,color:"#6b6b6b",fontWeight:"bold",fontSize:14}}
                        >{SubText}
                        </Text>
                        <View style={{width:170,height:25,marginTop:40,backgroundColor:"#a3dc00",justifyContent:"center"}}>
                            <Text 
                                style={{width:170, color:"white",fontWeight:"bold",fontSize:14,fontSize:12,textAlign:"center"}}
                                onPress={()=>this.props.navigation.navigate('ShowVideo',{videoPath:this.state.Videopath})}
                                >SHOW ME HOW TO MEASURE
                            </Text>
                        </View>
                        <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",height:50,width:160,backgroundColor:"#ebebeb",marginTop:10,borderRadius:25}}>
                            <View 
                             style={
                                ftstate ? styles.clickedMeasureButtons : styles.unclickedMeasureButtons
                              }
                            >
                                <Text 
                                    style={{color:"white"}}
                                    onPress={this.handleFT}
                                    
                                >FT IN</Text>
                            </View>
                            <View 
                                style={
                                    cmstate ? styles.clickedMeasureButtons : styles.unclickedMeasureButtons
                                  }
                            >
                                <Text 
                                    style={{color:"white"}}
                                    onPress={this.handleCM}
                                >CM</Text>
                            </View>
                            <View 
                                style={
                                    inchstate ? styles.clickedMeasureButtons : styles.unclickedMeasureButtons
                                  }
                            >
                                <Text 
                                   style={{color:"white"}}
                                   onPress={this.handleIN}
                                >IN</Text>
                            </View>
                        </View>
                        {ftstate &&(
                            <View>
                                <View style={{height:80,width:80,borderRadius:40,backgroundColor:"#a3dc00",marginLeft:40,marginTop:15,justifyContent:"center",alignItems:'center'}}>
                                        <Text style={{color:"white",fontSize:20}}>{ft}ft {inch}in</Text>
                                </View>
                                <View style={{flexDirection:"row",marginTop:10}} >
                                    <View style={{alignSelf: 'flex-start'}}>
                                        <TouchableHighlight onPress={this.handleFtInMinus} style={{borderRadius:35}}>
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center', backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                -
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{marginLeft:15}}>
                                        <TouchableHighlight onPress={this.handleFtInPlus} style={{borderRadius:35}} > 
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center',backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                +
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )}


                        {cmstate &&(
                            <View>
                                <View style={{height:80,width:80,borderRadius:40,backgroundColor:"#a3dc00",marginLeft:40,marginTop:15,justifyContent:"center",alignItems:'center'}}>
                                        <Text style={{color:"white",fontSize:20}}>{cm}cm</Text>
                                </View>
                                <View style={{flexDirection:"row",marginTop:10}} >
                                    <View style={{alignSelf: 'flex-start'}}>
                                        <TouchableHighlight onPress={this.handleCmMinus} style={{borderRadius:35}}>
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center', backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                -
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{marginLeft:15}}>
                                        <TouchableHighlight onPress={this.handleCmPlus} style={{borderRadius:35}}>
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center',backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                +
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )}

                        {inchstate &&(
                            <View>
                                <View style={{height:80,width:80,borderRadius:40,backgroundColor:"#a3dc00",marginLeft:40,marginTop:15,justifyContent:"center",alignItems:'center'}}>
                                        <Text style={{color:"white",fontSize:20}}>{indivdualInch}inch</Text>
                                </View>
                                <View style={{flexDirection:"row",marginTop:10}} >
                                    <View style={{alignSelf: 'flex-start'}}>
                                        <TouchableHighlight onPress={this.handleInchMinus} style={{borderRadius:35}}>
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center', backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                -
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={{marginLeft:15}}>
                                        <TouchableHighlight onPress={this.handleInchPlus} style={{borderRadius:35}}>
                                            <Text style={{fontSize:35, color:'gray', fontWeight:'bold', textAlign:'center',backgroundColor:'lightgray', width:70, height:70, borderRadius:35, textAlignVertical:'center'}}>
                                                +
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={{flexDirection:"row",marginTop:20, marginBottom:20}}>
                            <View style={{height:30,width:70,justifyContent:"center",alignItems:"center",backgroundColor:"#a3dc00",borderRadius:8}}>
                                <Text 
                                    style={{color:"white"}}
                                    onPress={this.handleSave}
                                >SAVE</Text>
                            </View>
                            <View style={{height:30,width:70,justifyContent:"center",alignItems:"center",backgroundColor:"#bbbbbb",borderRadius:8,marginLeft:15}}>
                                <Text 
                                    style={{color:"white"}}
                                    onPress={this.handleClear}
                                >CLEAR</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{width:screenWidth/2.1, marginRight:20}}>
                        <Image 
                            style={{width:190,height:screenHeight-120}}
                            source={{uri:FemaleGroupImageURFemaleMeasurementImageURL}}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>
            )}
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
   clickedMeasureButtons:{
       height:40,
       width:40,
       borderRadius:20,
       backgroundColor:"#a3dc00",
       marginLeft:10,
       justifyContent:"center",
       alignItems:"center"
    },
    unclickedMeasureButtons:{
       height:40,
       width:40,
       borderRadius:20,
       backgroundColor:"#bbbbbb",
       marginLeft:10,
       justifyContent:"center",
       alignItems:"center"
    },
})