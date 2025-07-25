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
import LoanApprovalPanel from './pages/LoanApproval'
import Members from './pages/Members'

function App() {
  

  return (
    <>
    {location.pathname !== '/' && <Navbar />}
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route element={<ProtectedRoute />}> 
        <Route path="/books" element={<Books />} />
        <Route path="/loans" element={<Loans />} />   
        <Route path="/reservations" element={<Reservations />} />  
        <Route path="/add-book" element={<AddBook />} /> 
        <Route path="/edit-book/:bookId" element={<EditBook />} /> 
        <Route path="/loan-approval" element={<LoanApprovalPanel />} />
        <Route path="/members" element={<Members />} />     
      </Route>
    </Routes>
    </>
  )
}

export default App
