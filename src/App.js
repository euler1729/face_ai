import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignInForm from './components/SignInForm/SignInForm';
import Register from './components/Register/Register';
import './App.css';

const url = 'https://face-ai-backend.herokuapp.com/'
// const url= 'http://localhost:4000/';
const initialState = {
  input: '',
  imageUrl: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: '',
  }
}
class App extends Component {

  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: '',
      }
    }
  }
  componentDidMount() {
    fetch('url')
      .then(response => response.json())
  }

  calculateFaceLocation = (data) => {
    var arr = data.outputs[0].data.regions;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    var clarifaiFace;
    var tmp = {};
    var box = [];
    for (let i = 0; i < arr.length; ++i) {
      clarifaiFace = arr[i];
      tmp = {
        leftCol: clarifaiFace.region_info.bounding_box.left_col * width,
        topRow: clarifaiFace.region_info.bounding_box.top_row * height,
        rightCol: width - (clarifaiFace.region_info.bounding_box.right_col * width),
        bottomRow: height - (clarifaiFace.region_info.bounding_box.bottom_row * height),
      }
      box.push(tmp);
    }
    return box;
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }
  onPictureSubmit = () => {

    this.setState({ imageUrl: this.state.input });
    fetch(url + 'imageUrl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response=>response.json())
    .then(response => {
        if (response) {
          fetch(url + 'image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    }
    this.setState({ isSignedIn: (route === 'home') })
    this.setState({ route: route })
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined,
      }
    })
  }

  render() {
    const { imageUrl, box, route, isSignedIn } = this.state;
    return (
      <div className="App">
        <Particle />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {route === 'home' ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
          : (route === 'signin' || route === 'signout' ?
            <SignInForm onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          )
        }
      </div>
    )
  }
}

export default App;
