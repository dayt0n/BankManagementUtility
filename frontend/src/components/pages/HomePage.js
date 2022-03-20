import logo from '../logo.png';
import './HomePage.css';

function HomePage() {
  return (
    <div className="App">
      <header className="AppHeader">
        <img src={logo} className="BankLogo" />
        <p>
          Bank
        </p>
        <div className="LoginText">
          <div className="NewUser">
            <li>
              New
            </li>
            <li>
              Customer
            </li>
            <br></br>
            <button className="Button">Create Account</button>
          </div>
          <div className="ExistingUser">
            <li>
              Existing
            </li>
            <li>
              Customer
            </li>
            <br></br>
            <label for="Uname">Username:</label> 
            <br></br>
            <input type="text" id="Uname" name="Uname"></input> 
            <br></br>
            <label for="Pword">Password:</label>
            <br></br>
            <input type="password" id="Pword" name="Pword"></input>
            <br></br>
            <br></br>
            <button className="Button">Log In</button>
            <p>
              Forgot Password?
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default HomePage;
