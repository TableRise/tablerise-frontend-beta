import { Routes, Route } from 'react-router-dom';
import PrivateRoute from 'src/components/PrivateRoute';
import Login from 'src/pages/Login';
import Match from './pages/Match';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}></Route>
        <Route path='/' element={<h1>TableRise</h1>} />
        <Route path='/login' element={<Login />} />
        <Route path='/match' element={<Match />} />
      </Routes>
    </>
  );
}

export default App
