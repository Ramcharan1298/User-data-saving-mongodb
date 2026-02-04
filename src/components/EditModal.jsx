import { useState, useEffect } from 'react';
import '../App.css'; // Reusing form styles

const EditModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fatherName: '',
    occupation: '',
    college: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        fatherName: user.fatherName || '',
        occupation: user.occupation || '',
        college: user.college || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user._id, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content form-wrapper">
        <header>
          <h2>Edit User</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" style={{ marginTop: 0 }}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
