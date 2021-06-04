import { Nav, Navbar } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Details from './Details';
import Home from './Home';
import Upload from './Upload';

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">API Parser</Navbar.Brand>

        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/upload">Upload</Nav.Link>
        </Nav>

      </Navbar>

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/upload" component={Upload} />
        <Route path="/details" component={Details} />
      </Switch>
    </div>
  );
}

export default App;
