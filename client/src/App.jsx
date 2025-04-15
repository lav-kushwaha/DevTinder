import {BrowserRouter,Routes,Route} from "react-router-dom"
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Body from "./Components/Body";
import {Provider} from 'react-redux'
import appStore from "./utils/appStore";
import Feed from "./Components/Feed";
import Connections from "./Components/Connections.jsx";
import Request from "./Components/Request.jsx";

function App() {
  return (
    <Provider store={appStore}>
    <BrowserRouter basename="/"> {/*basename slash means all routes will go through after "/"(slash)*/}
      <Routes>
      {/*Parent Route "/" is Body Component and login,profile are child route of Body which is render in outlet ex-Body.jsx*/}
      <Route path="/" element={<Body/>}>
        {/*child route of body-component */}
        <Route path="/" element={<Feed/>}></Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="profile" element={<Profile/>}></Route>
        <Route path="connections" element={<Connections/>}></Route>
        <Route path="requests" element={<Request/>}></Route>
      </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}
export default App;
