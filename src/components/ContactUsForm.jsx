import { useState } from 'react'

const ContactUsForm = ({chats,user_id}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_id: user_id,
    message: '',
    chats:(chats?JSON.stringify(chats):null)
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(user_id, "this is from userID")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Send form data to the backend API
        const response = await fetch('https://demo.webwideit.solutions/elc-erp/public/api/store-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.status) {
          // Reset form
          setFormData({
            name: '',
            email: '',
            user_id: '',
            message: ''
          });
          
          // Set submitted state
          setSubmitted(true);
          alert('Your Query has been sent to us successfully!');
        } else {
          alert('There was a problem submitting your form. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was a problem connecting to the server. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col contact-form-success">
        <p className='m-auto text-center p-6 bg-gray-100 rounded-3xl'>Thank you for contacting us! Your message has been sent.</p>
      </div>
    );
  }
  
  return (
    <div className="contact-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        
        {/* <div className="form-group">
          <label htmlFor="user_idsub">user_idSub</label>
          <select
            id="user_idsub"
            name="user_idsub"
            value={formData.user_idsub}
            onChange={handleChange}
          >
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Support</option>
            <option value="billing">Billing Question</option>
            <option value="other">Other</option>
          </select>
        </div> */}
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "input-error" : ""}
          />
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <style>{`
        .contact-form {
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        
        .form-group {
          margin-bottom: 12px;
        }
        
        label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .input-error {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }
        
        .submit-button {
          background-color: #376B7E;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .submit-button:hover {
          background-color: #2a5060;
        }
        
        .submit-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .contact-form-success {
          padding: 15px;
          background-color: #d4edda;
          color: #155724;
          border-radius: 4px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default ContactUsForm;