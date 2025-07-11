import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProtectedRoute from './layouts/ProtectedRoute'
import Navbar from './components/NavBar'
import Books from './pages/Books'
import Loans from './pages/Loans'
import Reservations from './pages/Reservations'
import AddBook from './pages/AddBooks'
import EditBook from './pages/EditBook'

function App() {
  

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<Home />} /> 
        <Route path="/books" element={<Books />} />
        <Route path="/loans" element={<Loans />} />   
        <Route path="/reservations" element={<Reservations />} />  
        <Route path="/add-book" element={<AddBook />} /> 
        <Route path="/edit-book/:bookId" element={<EditBook />} />     
      </Route>
    </Routes>
    </>
  )
}

export default App
