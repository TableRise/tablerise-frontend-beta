import { Routes, Route } from 'react-router-dom';
import PrivateRoute from 'src/components/PrivateRoute';
import Login from 'src/pages/Login';

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}></Route>
        <Route path='/' element={<h1>TableRise</h1>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App
