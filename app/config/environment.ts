export const environment = {
  // Validation settings
  emailValidation: true,  // Email doğrulaması aktif/pasif
  
  // API endpoints
  apiUrl: 'https://intfinex.azurewebsites.net',
  
  // Validation endpoints
  verificationEndpoints: {
    sendEmail: '/Verification/SendEmail',
    validateEmail: '/Verification/ValidateEmailCode'
  }
};
