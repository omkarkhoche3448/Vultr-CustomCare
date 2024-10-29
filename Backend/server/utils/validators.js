const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!hasUppercase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowercase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumber) {
        errors.push('Password must contain at least one number');
    }
    if (!hasSpecial) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim()
        .replace(/[<>]/g, '') // Basic XSS protection
        .replace(/'/g, "''"); // Basic SQL injection protection
};

module.exports = {
    validatePassword,
    sanitizeInput
};