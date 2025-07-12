
import { UserProvider } from './Component/Context'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import { SignupForm  } from './Component/SignUp'
function App() {
  const [user, setUser] = useState(0)

  return (
    <UserProvider  >
      <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
      </Routes>
      </BrowserRouter>

    </UserProvider>
  )
}


export default App
