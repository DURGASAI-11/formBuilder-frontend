import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './allForms.css' // Ensure the CSS file is included

function AllForms() {
  const [forms, setForms] = useState([])
  const navigate = useNavigate()
  const [deleteStat, setDeleteStat] = useState(false)

  useEffect(() => {
    axios('http://localhost:3001/form')
      .then((response) => setForms(response.data.forms))
      .catch((error) => console.error('Error fetching forms:', error))
  }, [deleteStat])

  const handleView = (id) => {
    navigate(`/form/${id}`)
  }

  const handleEdit = (id) => {
    navigate(`/form/${id}/edit`)
  }

  const handleDelete = (id) => {
    axios(`http://localhost:3001/form/deleteForm/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response) {
          setForms(forms.filter((form) => form._id !== id))
          setDeleteStat(!deleteStat)
        }
      })
      .catch((error) => console.error('Error deleting form:', error))
  }

  return (
    <div className="form-container">
      <h1>All Forms</h1>
      {forms.length === 0 ? (
        <p className="no-forms-message">No forms available</p>
      ) : (
        <div className="form-cards-container">
          {forms.map((form) => (
            <div key={form._id} className="form-card">
              <div className="form-card-content">
                <h2 className="form-card-title">{form.formName}</h2>
                <div className="form-card-actions d-flex">
                  <button
                    className="view-btn"
                    onClick={() => handleView(form._id)}
                  >
                    View
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(form._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(form._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllForms
