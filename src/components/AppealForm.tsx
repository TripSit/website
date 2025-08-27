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

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
      <label>
        Do you know why you were banned?
        <textarea name="reason" value={formData.reason} onChange={handleChange} required />
      </label>
      <label>
        Have you taken any steps to make amends?
        <textarea name="solution" value={formData.solution} onChange={handleChange} required />
      </label>
      <label>
        What will you do to avoid repeating the behavior?
        <textarea name="future" value={formData.future} onChange={handleChange} required />
      </label>
      <label>
        Anything else you’d like to add?
        <textarea name="extra" value={formData.extra} onChange={handleChange} />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Appeal"}
      </button>
    </form>
  );
};

export default AppealForm;
