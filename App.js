import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Weather from './components/Weather';

const KEY = require('./utils/weatherAPIKey');

export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 20,
    weatherCondition: 'rain',
    error: null
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: 'Error Getting Weather Conditions'
        });
      }
    );
  }

  converTemp(temp){
    var celsius = ( (temp - 32) / 1.8 ).toFixed(1);
    return celsius;
  }

  fetchWeather(lat, lon) {
    const url = `https://api.darksky.net/forecast/${KEY.API_Key}/${lat},${lon}?exclude=minutely,hourly,daily,flags`;
    fetch(url, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        var temperature = parseFloat(this.converTemp(res.currently.temperature));
        this.setState({
          temperature: temperature,
          weatherCondition: res.currently.icon,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={[styles.container, styles.horizontal]}>
        {isLoading ? (
          <ActivityIndicator size='large' color="#0000ff" />
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
