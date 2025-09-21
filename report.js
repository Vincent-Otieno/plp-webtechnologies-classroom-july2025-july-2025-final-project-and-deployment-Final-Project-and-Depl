// Report form specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reportForm');
    const anonymousCheckbox = document.getElementById('anonymous');
    const contactCard = document.getElementById('contactCard');
    const successMessage = document.getElementById('successMessage');
    
    // Handle anonymous checkbox
    anonymousCheckbox.addEventListener('change', function() {
        if (this.checked) {
            contactCard.style.display = 'none';
            // Clear required attributes for contact fields
            document.getElementById('reporterName').removeAttribute('required');
            document.getElementById('reporterEmail').removeAttribute('required');
        } else {
            contactCard.style.display = 'block';
            // Add required attributes back
            document.getElementById('reporterName').setAttribute('required', '');
            document.getElementById('reporterEmail').setAttribute('required', '');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('reporterPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }

    // Auto-save form data
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            saveFormDraft();
        });
    });

    // Load saved form data
    loadFormDraft();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateReportForm()) {
            submitReport();
        }
    });
});

function validateReportForm() {
    let isValid = true;
    
    // Clear previous errors
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.textContent = '');
    
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#d1d5db';
    });

    // Validate incident type
    const incidentType = document.getElementById('incidentType');
    if (!incidentType.value) {
        showError('incidentType', 'Please select an incident type');
        isValid = false;
    }

    // Validate description
    const description = document.getElementById('description');
    if (!description.value.trim()) {
        showError('description', 'Please provide a description of the incident');
        isValid = false;
    }

    // Validate contact information if not anonymous
    const anonymous = document.getElementById('anonymous');
    if (!anonymous.checked) {
        const reporterName = document.getElementById('reporterName');
        const reporterEmail = document.getElementById('reporterEmail');

        if (!reporterName.value.trim()) {
            showError('reporterName', 'Name is required for non-anonymous reports');
            isValid = false;
        }

        if (!reporterEmail.value.trim()) {
            showError('reporterEmail', 'Email is required for non-anonymous reports');
            isValid = false;
        } else if (!validateEmail(reporterEmail.value)) {
            showError('reporterEmail', 'Please enter a valid email address');
            isValid = false;
        }
    }

    return isValid;
}

function submitReport() {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate form submission (in real app, this would be an API call)
    setTimeout(() => {
        // Generate report ID
        const reportId = 'SR-' + Date.now().toString().slice(-8);
        document.getElementById('reportId').textContent = reportId;

        // Hide form and show success message
        document.getElementById('reportForm').style.display = 'none';
        successMessage.style.display = 'block';

        // Clear saved form data
        clearFormData('reportForm');

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Reset form after delay
        setTimeout(() => {
            resetForm();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 5000);

    }, 2000); // Simulate network delay
}

function resetForm() {
    const form = document.getElementById('reportForm');
    form.reset();
    
    // Reset contact card visibility
    const contactCard = document.getElementById('contactCard');
    contactCard.style.display = 'block';
    
    // Clear all errors
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(el => el.textContent = '');
    
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#d1d5db';
    });
}

function saveFormDraft() {
    const formData = new FormData(document.getElementById('reportForm'));
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add checkbox states
    data.anonymous = document.getElementById('anonymous').checked;
    data.consentToContact = document.getElementById('consentToContact').checked;
    data.emergencyContact = document.getElementById('emergencyContact').checked;
    
    saveFormData('reportForm', data);
}

function loadFormDraft() {
    const savedData = loadFormData('reportForm');
    if (!savedData) return;
    
    // Populate form fields
    Object.keys(savedData).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = savedData[key];
            } else {
                element.value = savedData[key];
            }
        }
    });
    
    // Trigger anonymous checkbox change event
    const anonymousCheckbox = document.getElementById('anonymous');
    if (anonymousCheckbox.checked) {
        anonymousCheckbox.dispatchEvent(new Event('change'));
    }
}

// Character counter for textareas
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('.form-textarea');
    
    textareas.forEach(textarea => {
        // Add character counter
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;';
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const current = textarea.value.length;
            const max = textarea.getAttribute('maxlength') || 2000;
            counter.textContent = `${current}/${max} characters`;
            
            if (current > max * 0.9) {
                counter.style.color = '#dc2626';
            } else {
                counter.style.color = '#6b7280';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    });
});

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            if (this.style.borderColor === 'rgb(220, 38, 38)') {
                clearError(this.id);
            }
        });
    });
});

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    // Skip validation for optional fields
    if (!field.hasAttribute('required') && !value) {
        return true;
    }
    
    switch (fieldId) {
        case 'reporterEmail':
            if (value && !validateEmail(value)) {
                showError(fieldId, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'reporterPhone':
            if (value && !validatePhone(value)) {
                showError(fieldId, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'description':
            if (value.length < 10) {
                showError(fieldId, 'Please provide more detail (at least 10 characters)');
                return false;
            }
            break;
    }
    
    clearError(fieldId);
    return true;
}

// Emergency contact handling
document.addEventListener('DOMContentLoaded', function() {
    const emergencyCheckbox = document.getElementById('emergencyContact');
    
    emergencyCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Show emergency notice
            const notice = document.createElement('div');
            notice.id = 'emergencyNotice';
            notice.className = 'emergency-notice';
            notice.innerHTML = `
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <div style="display: flex; align-items: center; color: #dc2626;">
                        <span style="font-size: 1.25rem; margin-right: 0.5rem;">🚨</span>
                        <strong>Emergency Contact Requested</strong>
                    </div>
                    <p style="color: #7f1d1d; margin-top: 0.5rem; font-size: 0.875rem;">
                        We will prioritize your report and attempt to contact you within 2 hours during business hours, 
                        or first thing the next business day. If you need immediate help, please call 911 or 1-800-799-7233.
                    </p>
                </div>
            `;
            
            const contactCard = document.getElementById('contactCard');
            contactCard.appendChild(notice);
        } else {
            // Remove emergency notice
            const notice = document.getElementById('emergencyNotice');
            if (notice) {
                notice.remove();
            }
        }
    });
});