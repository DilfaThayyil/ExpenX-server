export const validateEmail = (email: string): { isValid: boolean, message: string } => {
    const allowedDomains = ['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Invalid email format' };
    }
    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      return { isValid: false, message: 'Email domain is not allowed' };
    }
    return { isValid: true, message: '' };
  };
  
 export const validatePassword = (password: string): { isValid: boolean, message: string } => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return { isValid: false, message: 'Password must be at least 6 characters long, include one uppercase letter, one number, and one special character' };
    }
    return { isValid: true, message: '' };
  };
  
  export const validate = (email: string, password: string): { isValid: boolean, messages: string[] } => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
  
    const messages: string[] = [];
    if (!emailValidation.isValid) {
      messages.push(emailValidation.message);
    }
    if (!passwordValidation.isValid) {
      messages.push(passwordValidation.message);
    }
  
    return {
      isValid: emailValidation.isValid && passwordValidation.isValid,
      messages
    };
  };
  

   