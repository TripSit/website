// src/components/AppealForm.tsx
import React, { useState } from "react";

interface AppealFormProps {
  onSubmit: (data: {
    reason: string;
    solution: string;
    future: string;
    extra?: string;
  }) => void;
  submitting: boolean;
}

const AppealForm: React.FC<AppealFormProps> = ({ onSubmit, submitting }: AppealFormProps) => {
  const [formData, setFormData] = useState({
    reason: "",
    solution: "",
    future: "",
    extra: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate required fields
    if (!formData.reason.trim() || !formData.solution.trim() || !formData.future.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const totalLength = Object.values(formData).join('').length;
    if (totalLength > 3600) {
      alert('Your response is over 3600 characters long. Please keep your answers concise.');
      return;
    }

    onSubmit(formData);
  };

  const totalChars = Object.values(formData).join('').length;
  const charLimit = 3600;
  const isNearLimit = totalChars > charLimit * 0.8;

  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reason" className="form-label">
              <strong>Do you know why you were banned?</strong>
              <span className="text-danger ms-1">*</span>
            </label>
            <textarea 
              id="reason"
              name="reason" 
              value={formData.reason} 
              onChange={handleChange} 
              required 
              className="form-control"
              rows={4}
              placeholder="Please explain what you believe led to your ban..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="solution" className="form-label">
              <strong>Have you taken any steps to make amends?</strong>
              <span className="text-danger ms-1">*</span>
            </label>
            <textarea 
              id="solution"
              name="solution" 
              value={formData.solution} 
              onChange={handleChange} 
              required 
              className="form-control"
              rows={4}
              placeholder="Describe any actions you've taken to address the situation..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="future" className="form-label">
              <strong>What will you do to avoid repeating the behavior?</strong>
              <span className="text-danger ms-1">*</span>
            </label>
            <textarea 
              id="future"
              name="future" 
              value={formData.future} 
              onChange={handleChange} 
              required 
              className="form-control"
              rows={4}
              placeholder="Explain how you plan to prevent similar issues in the future..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="extra" className="form-label">
              <strong>Anything else you'd like to add?</strong>
              <small className="text-muted ms-2">(Optional)</small>
            </label>
            <textarea 
              id="extra"
              name="extra" 
              value={formData.extra} 
              onChange={handleChange}
              className="form-control"
              rows={3}
              placeholder="Any additional information or context you'd like to provide..."
            />
          </div>

          <div className="mb-3">
            <small className={`form-text ${isNearLimit ? 'text-warning' : 'text-muted'}`}>
              Character count: {totalChars}/{charLimit}
              {isNearLimit && ' (Getting close to limit!)'}
            </small>
          </div>

          <div className="text-center">
            <button 
              type="submit" 
              disabled={submitting || totalChars > charLimit}
              className={`btn btn-primary btn-lg px-4 ${submitting ? 'disabled' : ''}`}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit Appeal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppealForm;