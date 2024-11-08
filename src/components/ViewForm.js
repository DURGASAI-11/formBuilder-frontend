import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function ViewForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/form/${id}`)
        setFormData(response.data)
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    if (id) {
      fetchFormData()
    }
  }, [id])

  const handleChange = (e, fieldIndex) => {
    const { value } = e.target
    setFormData((prevData) => {
      const updatedFields = [...prevData.fields]
      updatedFields[fieldIndex].value = value
      return { ...prevData, fields: updatedFields }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const updatedData = formData.fields
      //   console.log('Updated values:', updatedData)
      await axios.put(`http://localhost:3001/form/${id}/edit`, {
        fields: updatedData,
        typeCheck: 'Yes',
      })
      //   console.log('Form updated:', response.data)
      navigate(`/forms`)
    } catch (error) {
      console.error('Error updating form:', error)
    }
  }

  if (!formData) return <div>Loading...</div>

  return (
    <div className="container mt-5">
      <h2 className="text-center">{formData.title}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row shadow-lg p-3">
          <h1>{formData.formName}</h1>
          {formData.fields.map((field, index) => (
            <div key={index} className="col-md-6 mb-3">
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                className="form-control"
                placeholder={field.placeholder}
                name="value"
                value={field.value || ''}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary mt-3">
            Update Form
          </button>
        </div>
      </form>
    </div>
  )
}

export default ViewForm
