import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './form.css'

function Form() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formHelpers, setFormHelpers] = useState({
    addInpStat: false,
  })
  const [formFields, setFormFields] = useState([])
  const [editField, setEditField] = useState(null)
  const [editData, setEditData] = useState({ title: '', placeholder: '' })
  const [formTitle, setFormTitle] = useState('')

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3001/form/${id}`)
        .then((response) => {
          // console.log(response.data.fields)
          setFormFields(response.data.fields)
          setFormTitle(response.data.formName)
        })
        .catch((error) => console.error('Error fetching form data:', error))
    }
  }, [id])

  const handleSelection = (buttonCode) => () => {
    const newField = {
      id: Date.now(),
      type: buttonCode,
      label: `${
        buttonCode.charAt(0).toUpperCase() + buttonCode.slice(1)
      } Input`,
      placeholder: '',
      value: '',
    }
    setFormFields((prevFields) => [...prevFields, newField])
  }

  const handleEditField = (field) => {
    setEditField(field)
    if (field.type === 'title') {
      setEditData({ title: formTitle })
    } else {
      setEditData({ title: field.label, placeholder: field.placeholder })
    }
  }

  const handleDeleteField = (fieldId) => {
    setFormFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId),
    )
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prevData) => ({ ...prevData, [name]: value }))

    if (editField && editField.type === 'title') {
      setFormTitle(value)
    } else {
      setFormFields((prevFields) =>
        prevFields.map((field) =>
          field.id === editField.id
            ? {
                ...field,
                [name === 'title' ? 'label' : name]: value,
              }
            : field,
        ),
      )
    }
  }

  const handleSubmit = async () => {
    try {
      const updatedForm = { title: formTitle, fields: formFields }
      if (id) {
        await axios.put(`http://localhost:3001/form/${id}/edit`, updatedForm)
        navigate('/forms')
      } else {
        await axios.post('http://localhost:3001/form/create', updatedForm)
        navigate('/forms')
      }

      // console.log('Form saved successfully')
    } catch (err) {
      console.error('Error submitting form:', err)
    }
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2>{id ? 'Edit Form' : 'Create Form'}</h2>
        <p className="text-muted">
          Create or edit dynamic forms using the form builder
        </p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-primary text-white">
              {id ? 'Edit Form Fields' : 'Form Creation'}
            </div>
            <div className="card-body">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  value={formTitle}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleEditField({ type: 'title' })}
                >
                  ✎
                </button>
              </div>

              <form className="form-grid">
                {formFields.map((field) => (
                  <div key={field.id} className="form-row">
                    <div className="form-group">
                      <label className="form-label d-flex flex-start">
                        {field.label}:
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="form-control"
                        readOnly
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEditField(field)}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        🪣
                      </button>
                    </div>
                  </div>
                ))}
              </form>

              <button
                className="btn btn-secondary w-100 mt-3"
                onClick={() =>
                  setFormHelpers((prevStat) => ({
                    ...prevStat,
                    addInpStat: !prevStat.addInpStat,
                  }))
                }
              >
                {formHelpers.addInpStat ? 'Close Input' : 'Add Input'}
              </button>

              {formHelpers.addInpStat && (
                <div className="mt-3 d-flex flex-wrap justify-content-center gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSelection('text')}
                  >
                    Text
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSelection('number')}
                  >
                    Number
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSelection('email')}
                  >
                    Email
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSelection('password')}
                  >
                    Password
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSelection('date')}
                  >
                    Date
                  </button>
                </div>
              )}
              <button
                className="btn btn-success mt-3 w-100"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {editField && (
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                {editField.type === 'title' ? 'Edit Title' : 'Edit Field'}
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label d-flex flex-start">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="form-control"
                  />
                </div>
                {editField.type !== 'title' && (
                  <div className="mb-3">
                    <label className="form-label d-flex flex-start">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      name="placeholder"
                      value={editData.placeholder}
                      onChange={handleEditChange}
                      className="form-control"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Form
