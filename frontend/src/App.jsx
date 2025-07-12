
import { UserProvider } from './Component/Context'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import { SignupForm  } from './Component/SignUp'
import { Home } from './Component/Home'
function App() {

  return (
    <UserProvider  >
      <BrowserRouter>
      <Routes>
          
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
      </Routes>
      </BrowserRouter>

    </UserProvider>
  )
}


export default App
