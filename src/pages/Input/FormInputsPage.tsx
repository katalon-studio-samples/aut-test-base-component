// Create an end-to-end flow to cover various input types with real-world scenarios
// Input types: email, image, number, password, tel, url
import React, { useState, useRef, useId } from "react";
import styles from "./Input.module.css";

export const FormInputsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    ssn: "",
    ipv4Address: "",
    ipv6Address: "",
    phone: "",
    zipCode: "",
    password: "",
    confirmPassword: "",
    creditCard: "",
    changePassword: false,
    dontTrackMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = useId();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // SSN validation (XXX-XX-XXXX format)
    if (formData.ssn && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn)) {
      newErrors.ssn = "SSN must be in format XXX-XX-XXXX";
    }

    // IPv4 Address validation
    if (formData.ipv4Address) {
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipv4Regex.test(formData.ipv4Address)) {
        newErrors.ipv4Address = "Please enter a valid IPv4 address (e.g., 192.168.1.1)";
      }
    }

    // IPv6 Address validation
    if (formData.ipv6Address) {
      const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
      if (!ipv6Regex.test(formData.ipv6Address)) {
        newErrors.ipv6Address = "Please enter a valid IPv6 address (e.g., 2001:db8::1)";
      }
    }

    // Phone validation
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Zip code validation (US format)
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid US zip code (e.g., 12345 or 12345-6789)";
    }

    // Password validation (only if change password is checked)
    if (formData.changePassword) {
      if (!formData.password) {
        newErrors.password = "Password is required when changing password";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Credit card validation (basic Luhn algorithm check)
    if (formData.creditCard) {
      const cleanCard = formData.creditCard.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleanCard)) {
        newErrors.creditCard = "Please enter a valid credit card number";
      } else {
        // Basic Luhn algorithm check
        let sum = 0;
        let isEven = false;
        for (let i = cleanCard.length - 1; i >= 0; i--) {
          let digit = parseInt(cleanCard.charAt(i));
          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          sum += digit;
          isEven = !isEven;
        }
        if (sum % 10 !== 0) {
          newErrors.creditCard = "Invalid credit card number";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const formatSSN = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
  };

  const formatCreditCard = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    handleInputChange('ssn', formatted);
  };

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCreditCard(e.target.value);
    handleInputChange('creditCard', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (validateForm()) {
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString()
      };
      
      setResult(JSON.stringify(submissionData, null, 2));
      setErrors({});
    }
    
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      email: "",
      ssn: "",
      ipv4Address: "",
      ipv6Address: "",
      phone: "",
      zipCode: "",
      password: "",
      confirmPassword: "",
      creditCard: "",
      changePassword: false,
      dontTrackMe: false,
    });
    setErrors({});
    setResult("");
  };

  return (
    <div className={styles.container} id={`${id}-container`}>
      <h2 className={styles.h2} id={`${id}-title`}>
        Advanced Form Input Types Demo
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
        Real-world scenarios: User Registration, Financial Information, Contact Details
      </p>

      <form onSubmit={handleSubmit} id={`${id}-form`}>
        {/* Global Tracking Control */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div className={styles.inputGroup} id={`${id}-dont-track-group`}>
            <label htmlFor={`${id}-dont-track`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <input
                id={`${id}-dont-track`}
                type="checkbox"
                checked={formData.dontTrackMe}
                onChange={(e) => handleInputChange('dontTrackMe', e.target.checked)}
                style={{ margin: 0 }}
              />
              Don't track me
            </label>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px', marginLeft: '24px' }}>
            When enabled, all form fields will not be tracked by adding attribute "katalon-excluded"
          </div>
        </div>

        {/* Personal Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#2563eb', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
            Personal Information
          </h3>
          
          <div className={styles.inputGroup} id={`${id}-email-group`}>
            <label htmlFor={`${id}-email`}>
              Email Address: *
              <input
                id={`${id}-email`}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={styles.textInput}
                placeholder="user@example.com"
                required
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.email && <div className={styles.error} id={`${id}-email-error`}>{errors.email}</div>}

          <div className={styles.inputGroup} id={`${id}-ssn-group`}>
            <label htmlFor={`${id}-ssn`}>
              US Social Security Number:
              <input
                id={`${id}-ssn`}
                type="text"
                value={formData.ssn}
                onChange={handleSSNChange}
                className={styles.textInput}
                placeholder="123-45-6789"
                maxLength={11}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.ssn && <div className={styles.error} id={`${id}-ssn-error`}>{errors.ssn}</div>}

          <div className={styles.inputGroup} id={`${id}-phone-group`}>
            <label htmlFor={`${id}-phone`}>
              Phone Number:
              <input
                id={`${id}-phone`}
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={styles.textInput}
                placeholder="+1 (555) 123-4567"
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.phone && <div className={styles.error} id={`${id}-phone-error`}>{errors.phone}</div>}

          <div className={styles.inputGroup} id={`${id}-zip-group`}>
            <label htmlFor={`${id}-zip`}>
              Zip Code:
              <input
                id={`${id}-zip`}
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={styles.textInput}
                placeholder="12345 or 12345-6789"
                maxLength={10}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.zipCode && <div className={styles.error} id={`${id}-zip-error`}>{errors.zipCode}</div>}
        </div>

        {/* Network Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#059669', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
            Network Information
          </h3>
          
          <div className={styles.inputGroup} id={`${id}-ipv4-group`}>
            <label htmlFor={`${id}-ipv4`}>
              IPv4 Address:
              <input
                id={`${id}-ipv4`}
                type="text"
                value={formData.ipv4Address}
                onChange={(e) => handleInputChange('ipv4Address', e.target.value)}
                className={styles.textInput}
                placeholder="192.168.1.1"
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.ipv4Address && <div className={styles.error} id={`${id}-ipv4-error`}>{errors.ipv4Address}</div>}

          <div className={styles.inputGroup} id={`${id}-ipv6-group`}>
            <label htmlFor={`${id}-ipv6`}>
              IPv6 Address:
              <input
                id={`${id}-ipv6`}
                type="text"
                value={formData.ipv6Address}
                onChange={(e) => handleInputChange('ipv6Address', e.target.value)}
                className={styles.textInput}
                placeholder="2001:db8::1"
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.ipv6Address && <div className={styles.error} id={`${id}-ipv6-error`}>{errors.ipv6Address}</div>}
        </div>

        {/* Security Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#dc2626', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
            Security & Payment
          </h3>
          
          <div className={styles.inputGroup} id={`${id}-change-password-group`}>
            <label htmlFor={`${id}-change-password`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id={`${id}-change-password`}
                type="checkbox"
                checked={formData.changePassword}
                onChange={(e) => handleInputChange('changePassword', e.target.checked)}
                style={{ margin: 0 }}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
              Change Password
            </label>
          </div>

          <div className={styles.inputGroup} id={`${id}-password-group`}>
            <label htmlFor={`${id}-password`}>
              New Password: *
              <input
                id={`${id}-password`}
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={styles.textInput}
                placeholder="Minimum 8 characters with uppercase, lowercase, and number"
                required={formData.changePassword}
                disabled={!formData.changePassword}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.password && <div className={styles.error} id={`${id}-password-error`}>{errors.password}</div>}

          <div className={styles.inputGroup} id={`${id}-confirm-password-group`}>
            <label htmlFor={`${id}-confirm-password`}>
              Confirm New Password: *
              <input
                id={`${id}-confirm-password`}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={styles.textInput}
                placeholder="Re-enter your new password"
                required={formData.changePassword}
                disabled={!formData.changePassword}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.confirmPassword && <div className={styles.error} id={`${id}-confirm-password-error`}>{errors.confirmPassword}</div>}

          <div className={styles.inputGroup} id={`${id}-credit-card-group`}>
            <label htmlFor={`${id}-credit-card`}>
              Credit Card Number:
              <input
                id={`${id}-credit-card`}
                type="text"
                value={formData.creditCard}
                onChange={handleCreditCardChange}
                className={styles.textInput}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                katalon-excluded={formData.dontTrackMe ? "true" : undefined}
              />
            </label>
          </div>
          {errors.creditCard && <div className={styles.error} id={`${id}-credit-card-error`}>{errors.creditCard}</div>}
        </div>

        {/* Submit and Reset Buttons */}
        <div className={styles.inputGroup} id={`${id}-buttons-group`}>
          <input
            id={`${id}-submit`}
            type="image"
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA4MCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzEwYjk4MSIvPgo8dGV4dCB4PSI0MCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPlN1Ym1pdDwvdGV4dD4KPC9zdmc+Cg=="
            alt="Submit"
            width="80"
            height="48"
            className={`${styles.submitButton} ${styles.focusFlash}`}
            disabled={isSubmitting}
            style={{ 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              border: 'none',
              borderRadius: '8px'
            }}
            katalon-excluded={formData.dontTrackMe ? "true" : undefined}
          />
          <input
            id={`${id}-reset`}
            type="reset"
            value="Reset Form"
            className={styles.resetButton}
            onClick={handleReset}
            katalon-excluded={formData.dontTrackMe ? "true" : undefined}
          />
        </div>
      </form>

      {/* Results Display */}
      {result && (
        <div className={styles.result} id={`${id}-result`}>
          <h4 style={{ marginTop: 0, marginBottom: '12px' }}>Form Submission Result:</h4>
          <pre style={{ margin: 0, fontSize: '0.85rem' }}>{result}</pre>
        </div>
      )}

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className={styles.error} id={`${id}-validation-summary`}>
          <strong>Please fix the following errors:</strong>
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 