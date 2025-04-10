export const environment = {
  // Validation settings
  emailValidation: false,  // Email doğrulaması aktif/pasif
  smsValidation: false,    // SMS doğrulaması aktif/pasif
  
  // API endpoints
  apiUrl: 'https://intfinex.azurewebsites.net',
  
  // Validation endpoints
  verificationEndpoints: {
    sendSms: '/Verification/SendSms',
    validateSms: '/Verification/ValidateSmsCode',
    sendEmail: '/Verification/SendEmail',
    validateEmail: '/Verification/ValidateEmailCode'
  }
};
