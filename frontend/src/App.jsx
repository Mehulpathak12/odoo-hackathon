import { UserProvider } from './Context/UserContent';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignUp } from './Component/SignUp';
import { SignIn } from './Component/SignIn';
import { Home } from './Component/Home';
import { Profile } from './Component/Profile';
import { ProfileCard } from './Component/ProfileCard';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/:id' element={<ProfileCard />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
