/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet,  View} from 'react-native';
import { Avatar, Badge,  withBadge } from 'react-native-elements'
// import reducers from './redux/reducers/index';
import {createStackNavigator,createAppContainer,createBottomTabNavigator} from 'react-navigation';
import AppContain from '../src/navigator/index';
import { Header, Container, Left, Body, Right, Button, Icon, Title, Text,List,ListItem,Thumbnail,Toast ,Root   } from 'native-base';



const AppContainer =  createAppContainer(AppContain);

  class App extends Component{
    render(){
      return (<Root><AppContainer /></Root>);
    }
  }

export default App;
