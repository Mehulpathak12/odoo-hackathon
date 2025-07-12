
import { UserProvider } from './Component/Context'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import { SignUp  } from './Component/SignUp'
import { SignIn  } from './Component/SignIn'
import { Home } from './Component/Home'
import { Profile } from './Component/Profile'
function App() {

  return (
    <UserProvider  >
      <BrowserRouter>
      <Routes>
          
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      </BrowserRouter>

    </UserProvider>
  )
}


export default App
