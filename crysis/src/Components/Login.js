import React, { Component } from 'react';
import {
	View,
	Text,
  StyleSheet,
	TouchableHighlight,
  Image,
  TextInput
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import { sendLoginCredentials, getEmergencyStatus } from '../helpers/helperAPI';
import red from '../red.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameTextbox: '',
      passwordTextbox: '',
      errorMessage: ''
    }
  }

onSubmitLoginCredentials(){
	var self = this;
  dismissKeyboard();
	sendLoginCredentials({
		username: this.state.usernameTextbox,
		password: this.state.passwordTextbox
	})
  .then(function(){
    console.log('Credentials Approved');
    self.props.changeAuthState();
    return getEmergencyStatus()
  })
  .then(function(response){
    console.log('getEmergencyStatus response - ', response);
    return response.json(); 
  })
  .then(function(data){
    if (data.emergencyStatus === true) {
      console.log("emergencyStatus is true");
      self.props.changeEmergencyState();
      self.props.navigator.push({
        name: 'CheckIn'
      })
    } else {
      self.props.navigator.push({
        name: 'Home'
      })
    }
  })
  .catch(function(error){
    self.setState({errorMessage: 'Incorrect Login'})
    console.log('Error Approving Credentials - ', error);
  })
}

  render() {
    return (
      <Image style={styles.container} source={red}>
        <View style={styles.scrollView}>
          <View style={styles.modal}>
            <Text style={styles.title}>Crysis</Text>
            <Text style={styles.errorMessage}>{ this.state.errorMessage }</Text>
            <TextInput
              style={styles.textBoxes}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(usernameTextbox) => this.setState({usernameTextbox})}
              returnKeyType={'next'}
              placeholder={'Username'}
              value={this.state.usernameTextbox}
            />
            <TextInput
              style={styles.textBoxes}
              onChangeText={(passwordTextbox) => this.setState({passwordTextbox})}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholder={'Password'}
              secureTextEntry={true}
              //onSubmitEditing={this.navigate}
              value={this.state.passwordTextbox}
            />
            <TouchableHighlight
              onPress={ this.onSubmitLoginCredentials.bind(this) }
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableHighlight>
          </View>
          <KeyboardSpacer />
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    width: null,
    height: null
  },
  button: {
    justifyContent: 'center',
    height: 40,
    margin: 5,
    backgroundColor: '#6C1111',
  },
  buttonText: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'courier',
  },
  title: {
    alignSelf: 'center',
    marginTop: 15,
    fontSize: 50,
    fontFamily: 'courier',
  },
  errorMessage: {
    color: '#6C1111',
    fontFamily: 'courier',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: 'bold',
    justifyContent: 'center'
  },
  scrollView: {
    flex: 1,
    padding: 30
  },
  modal: {
    justifyContent: 'center',
    backgroundColor: "#FDFDF1",
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 2,
      width: 0
    }
  },
  textBoxes: {
    height: 40,
    margin: 5,
    padding: 10,
    fontFamily: 'courier',
    borderWidth: 2,
    borderColor: '#6C1111'
  }
});

export default Login;
