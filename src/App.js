import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const particleOptions ={
  particles: {
    number: {
      value:30,
      density: {
        enable:true,
        value_area: 200
      }
    }
  }
}

const clarifaiApp = new Clarifai.App({
  apiKey: '1612f275008045e4b2ec17fba33f6211'
});

const initialState = {
  input: '',
  imgUrl: '',
  boxes: [{}],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  calculateFaceLocation = (data) => {
    const boxes = [];
    // const face1 = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    for (const [i, face] of data.outputs[0].data.regions.entries()) {
      const info = face.region_info.bounding_box;
      boxes.push({
        key: i,
        leftCol: info.left_col * width,
        topRow: info.top_row * height,
        rightCol: width - (info.right_col * width),
        btmRow: height - (info.bottom_row * height)
      })

    }
    return boxes;
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imgUrl: this.state.input});

    clarifaiApp.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id,
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log("Error", err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  routeSwitch = () => {
    const {boxes, imgUrl, route} = this.state;
    switch (route) {
      case 'home':
        return(
          <div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onButtonDetect={this.onSubmit} 
              onInputChange={this.onInputChange}
            />
            <FaceRecognition boxes={boxes} imgUrl={imgUrl}/>
          </div>
        )
      case 'signin':
      case 'signout':
        return(<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
      case 'register':
        return(<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
      default:
    }
  }



  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particleOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { 
          this.routeSwitch()
        }
      </div>
    );
  };
};

export default App;
