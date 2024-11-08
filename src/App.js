import './App.css'
import Form from './components/Form'
import AllForms from './components/AllForms'
import ViewForm from './components/ViewForm'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/forms" element={<AllForms />} />
        <Route path="/form/:id" element={<ViewForm />} />
        <Route path="/form/:id/edit" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
