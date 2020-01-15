import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,  Image,} from 'react-native';
import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
import {createStackNavigator,createAppContainer,createBottomTabNavigator} from 'react-navigation';

import HomePage from '../screens/homePage';
import ForgotPage from '../screens/forgotPage'
import RegisterPage from '../screens/registerPage'
import ProfilePage from '../screens/profilePage'
import ResetPage from '../screens/resetPage'
import MenuPage from '../screens/menuPage'
import MeasurementPage from '../screens/measurementPage'
import GroupPage from '../screens/groupPage'
import HeightPage from '../screens/heightPage'
import LegPage from '../screens/legPage'
import ShowvideoPage from '../screens/showvideoPage'
import WaistPage from '../screens/waistPage'
import ArmPage from '../screens/armPage'
 
const AppContain =   createStackNavigator({
    Home: { screen: HomePage ,navigationOptions: { header: null }},
    Forgot:{screen:ForgotPage,navigationOptions: { header: null }},
    Register:{screen:RegisterPage,navigationOptions: { header: null }},
    Profile:{screen:ProfilePage,navigationOptions: { header: null }},
    Reset:{screen:ResetPage,navigationOptions: { header: null }},
    Menu:{screen:MenuPage,navigationOptions: { header: null }},
    Measurement:{screen:MeasurementPage,navigationOptions: { header: null }},
    Group:{screen:GroupPage,navigationOptions: { header: null }},
    Height:{screen:HeightPage,navigationOptions: { header: null }},
    Leg:{screen:LegPage,navigationOptions: { header: null }},
    Arm:{screen:ArmPage,navigationOptions: { header: null }},
    ShowVideo:{screen:ShowvideoPage,navigationOptions: { header: null }},
    Waist:{screen:WaistPage,navigationOptions: { header: null }},
    },
    {
        initialRouteName: 'Home',
    },

);


export default AppContain