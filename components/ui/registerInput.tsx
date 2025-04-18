import {
  Box,
  InputGroup,
  Input as ChakraInput,
  StackProps,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/alert';
import { useEffect } from 'react';

import { useToast } from '@chakra-ui/toast';
import { useSteps } from '@chakra-ui/stepper';
import { LuLock } from 'react-icons/lu';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CustomButton from '@/components/ui/button';
import { environment } from '@/app/config/environment';


interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  verificationCode: string;
  userId: string;
  [key: string]: string | undefined;
}

export default function RegisterInput(props: StackProps) {
  const toast = useToast();
  const { activeStep, goToNext, goToPrevious } = useSteps({ index: 0 });
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    verificationCode: '',
    userId: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      const dropdown = document.querySelector('.react-tel-input .country-list') as HTMLElement;
      if (dropdown && dropdown.style.display !== 'none') {
        setIsPhoneDropdownOpen(true);
      } else {
        setIsPhoneDropdownOpen(false);
      }
    }, 200); // sürekli kontrol et
  
    return () => clearInterval(interval); // temizlik
  }, []);



  const validateForm = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.email || !formData.password) {
        toast({
          title: 'Error',
          description: 'Please fill in all fields',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: 'Error',
          description: 'Please enter a valid email address',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      if (formData.phoneNumber && formData.phoneNumber.length < 10) {
        toast({
          title: 'Error',
          description: 'Please enter a valid phone number',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      if (formData.password.length < 6) {
        toast({
          title: 'Error',
          description: 'Password must be at least 6 characters long',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } else if (activeStep === 1) {
      if (!formData.verificationCode.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter the verification code',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }

    return true;
  };

  const sendEmailCode = async () => {
    console.log('sendEmailCode called with:', { email: formData.email, userId: formData.userId });

    if (!formData.userId) {
      console.log('sendEmailCode validation failed: userId is empty');
      toast({
        title: 'Error',
        description: 'User ID is missing. Please try registering again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    try {
      console.log('Sending email verification code for userId:', formData.userId);
      const response = await fetch('https://intfinex.azurewebsites.net/api/Verification/SendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId
        }),
      });

      if (!response.ok) {
        console.error('SendEmail API failed:', await response.text());
        throw new Error('Failed to send email code');
      }

      console.log('Email verification code sent successfully');
      toast({
        title: 'Success',
        description: 'Verification code sent to your email',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (err: unknown) {
      const error = err as Error;
      console.error('sendEmailCode error:', error);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  const validateEmailCode = async () => {
    if (!formData.verificationCode) {
      const errorMessage = 'Please enter the verification code';
      setVerifyError(errorMessage);
      setVerificationStatus('error');
      setVerificationMessage(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setVerificationStatus('idle');
      setVerificationMessage('Verifying code...');

      console.log('Sending validation request:', {
        userId: formData.userId,
        code: formData.verificationCode,
        timestamp: new Date().toISOString()
      });

      const verifyResponse = await fetch('https://intfinex.azurewebsites.net/api/Verification/ValidateEmailCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          code: formData.verificationCode
        }),
      });

      const verifyData = await verifyResponse.json();
      console.log('Verification API response:', {
        status: verifyResponse.status,
        isSuccess: verifyData.isSuccess,
        errors: verifyData.errors,
        timestamp: new Date().toISOString()
      });

      if (verifyResponse.ok && verifyData.isSuccess && (!verifyData.errors || verifyData.errors.length === 0)) {
        console.log('Validation successful');
        setVerifyError('');
        setVerificationStatus('success');
        setVerificationMessage('Email verification successful!');
        setIsSuccess(true);

        toast({
          title: 'Success',
          description: 'Email address successfully verified!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        try {
          // Get temporary user information
          const tempUserStr = localStorage.getItem('tempUser');
          if (!tempUserStr) {
            throw new Error('User information not found');
          }

          const tempUser = JSON.parse(tempUserStr);

          // Login attempt
          const loginResponse = await fetch('https://intfinex.azurewebsites.net/api/Login/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: tempUser.email,
              password: tempUser.password
            })
          });
          
          console.log("Login information:", {
            email: tempUser.email,
            password: tempUser.password
          });
          
          console.log('Status:', loginResponse.status);
          console.log('StatusText:', loginResponse.statusText);
          
          if (!loginResponse.ok) {
            throw new Error(`API error: ${loginResponse.status} ${loginResponse.statusText}`);
          }
          
          const loginData = await loginResponse.json();
          console.log('Parsed login data:', loginData);

          // API response check
          console.log('Login response status:', loginResponse.status);
          console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));

          if (!loginResponse.ok) {
            throw new Error(`API error: ${loginResponse.status} ${loginResponse.statusText}`);
          }

          if (!loginData.isSuccess) {
            throw new Error(loginData.errors?.[0] || 'Login failed');
          }

          // Login successful, save user information
          localStorage.clear(); // Clear temporary data

          const userData = {
            ...tempUser,
            token: loginData.data 
          };
          delete userData.password; // Şifre silinsin
          
          localStorage.setItem('userData', JSON.stringify(loginData));
          localStorage.setItem('userEmail', tempUser.email);
          console.log("[DEBUG] localStorage tüm içerik:", { ...localStorage });

          // Dashboard'a yönlendir
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);

          return true;
        } catch (error: unknown) {
          console.error('Login error:', error);
          let errorMessage = 'Login failed';
          
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          toast({
            title: 'Error',
            description: errorMessage,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
      } else {
        const errorMessage = verifyData.errors?.[0] || 'Validation failed. Please try again.';
        console.log('Validation failed:', {
          responseOk: verifyResponse.ok,
          isSuccess: verifyData.isSuccess,
          errors: verifyData.errors,
          errorMessage
        });

        setVerifyError(errorMessage);
        setVerificationStatus('error');
        setVerificationMessage(errorMessage);
        
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        
        return false;
      }
    } catch (error: unknown) {
      console.error('Validation error:', error);
      const errorMessage = 'Validation failed. Please try again.';
      
      setVerifyError(errorMessage);
      setVerificationStatus('error');
      setVerificationMessage(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setRegistrationError(''); // Her denemede hata mesajını temizle
      console.log('Starting registration process...');
      
      // Geçici bir uniqueId oluştur
      const uniqueId = crypto.randomUUID();
      console.log('Generated uniqueId:', uniqueId);
      
      // Register işlemini yap
      console.log('Sending registration request with data:', {
        name: formData.name,
        email: formData.email,
        uniqueId: uniqueId
      });

      const registerResponse = await fetch('https://intfinex.azurewebsites.net/api/User/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber || '',
          password: formData.password,
          uniqueId: uniqueId
        }),
      });

      const result = await registerResponse.json();

      if (registerResponse.ok && result.isSuccess) {
        const userId = result.data[0].id;
        const userEmail = result.data[0].email;

        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem('userData', JSON.stringify(result.data[0]));
        localStorage.setItem('userEmail', userEmail);

        // userId'yi state'e kaydet
        setFormData(prev => ({ ...prev, userId }));

        // Email doğrulama kodunu gönder
        await sendEmailCode();

      } else {
        // API'den gelen hata mesajını göster
        const errorMsg = result.errors?.[0] || 'Registration failed';
        setRegistrationError(errorMsg);
        toast({
          title: 'Error',
          description: errorMsg,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }

      // API'nin döndüğü ID'yi al
      const userId = result.data[0].id;
      if (!userId) {
        throw new Error('User ID not received from registration');
      }

      console.log('Registration successful, received userId:', userId);

      // Biraz bekleyelim ki backend'de kullanıcı oluşturulsun
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Attempting to send verification email:', {
        userId: userId,
        email: formData.email
      });

      // Email doğrulama kodunu gönder
      console.log('Sending verification email request:', {
        userId: userId,
        email: formData.email,
        timestamp: new Date().toISOString()
      });

      const emailResponse = await fetch('https://intfinex.azurewebsites.net/api/Verification/SendEmail', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId
        }),
      });

      const emailResponseData = await emailResponse.json();
      console.log('Email API Response:', {
        status: emailResponse.status,
        isSuccess: emailResponseData.isSuccess,
        errors: emailResponseData.errors,
        timestamp: new Date().toISOString()
      });

      if (!emailResponse.ok || !emailResponseData.isSuccess) {
        const errorMessage = emailResponseData.errors?.[0] || 'Email gönderimi başarısız oldu. Lütfen tekrar deneyin.';
        setRegistrationError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      // Email gönderme başarılı olduğunda kullanıcıya bilgi ver
      console.log('Email verification code sent successfully to:', formData.email);
      
      toast({
        title: 'Success',
        description: 'Verification code sent to your email.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Geçici kullanıcı bilgilerini localStorage'a kaydet
      const tempUserData = {
        id: userId,
        name: formData.name,
        email: formData.email,
        password: formData.password,  // Login için gerekecek
        phoneNumber: formData.phoneNumber || '',
        uniqueId: uniqueId
      };
      localStorage.setItem('tempUser', JSON.stringify(tempUserData));

      // Login denemesi yap
      // try {
      //   const loginResponse = await fetch('https://intfinex.azurewebsites.net/api/User/Login', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       email: formData.email,
      //       password: formData.password
      //     })
      //   });

      //   const loginData = await loginResponse.json();

      //   if (loginResponse.ok && loginData.isSuccess) {
      //     // Login başarılı, kullanıcı bilgilerini kaydet
      //     const userData = {
      //       id: userId,
      //       name: formData.name,
      //       email: formData.email,
      //       phoneNumber: formData.phoneNumber || '',
      //       uniqueId: uniqueId,
      //       token: loginData.data?.token
      //     };
      //     localStorage.setItem('user', JSON.stringify(userData));

      //     // Dashboard'a yönlendir
      //     window.location.href = '/dashboard';
      //     return true;
      //   }
      // } catch (error) {
      //   console.error('Login error:', error);
      // }

      // Login başarısız olsa bile form verilerini güncelle ve devam et
      setFormData(prev => ({
        ...prev,
        userId: userId
      }));

      // Sonraki adıma geç
      goToNext();
      return true;

      console.log('Email verification code sent successfully');
      
      // Başarılıysa state'i güncelle ve ilerle
      console.log('Updating formData with userId:', userId);
      setFormData(prev => {
        console.log('Previous formData:', prev);
        const newState = { ...prev, userId: userId };
        console.log('New formData:', newState);
        return newState;
      });

      console.log('Calling goToNext()');
      goToNext();

      toast({
        title: 'Success',
        description: 'Verification code sent to your email',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error in handleNext:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process registration',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const success = await validateEmailCode();
    setLoading(false);

    if (success) {
      setIsSuccess(true);
      setVerificationStatus('success');
    }
  };

  type InputField = [string, string, React.ComponentType];

  const inputFields: InputField[] = [
    ['name', 'Name', FaUser],
    ['email', 'Email', FaEnvelope],
    ['phoneNumber', 'Phone Number', FaPhone],
    ['password', 'Password', LuLock]
  ];

  const styles = {
  solid: {
    bg: "#36b0e2",
    color: "#000A1C",
    width: "100%",
    mt: { base: 0, sm: -10 },
    _hover: {
      color: "#ffffff",
      bg: "linear-gradient(to top, rgb(0, 32, 71) 1%, rgb(54, 176, 226) 10%, rgb(0, 32, 71) 100%)",
      transform: "translateX(5px)",
    }
  },
  outline: {
    bg: "transparent",
    color: "#36b0e2",
    border: "2px solid rgb(229, 96, 6)",
    _hover: {
      bg: "#36b0e2",
      color: "#000A1C",
      transform: "translateX(5px)",
    }
  }
};

return (
  <Flex 
    direction="column"
      alignItems="center"
    justifyContent="center"
    mx="auto"
    p={{ base: "20px", sm: "30px", md: "40px" }} 
    borderRadius={{ base: "8px", sm: "10px"}}  
    width="100%"
    {...props}
  >
    <Box 
      width="100%"
      maxW={{ base: '400px', lg: '500px' }}
      mx="auto"
    >
      {activeStep === 0 && (
        <Box 
          mt={{ base: "15px", sm: "20px" }} 
          display="grid" 
          gridTemplateColumns={{ base: "1fr", md: "repeat(1, 1fr)" }} 
          width="45%" 
        >
          {inputFields.map(([name, placeholder, Icon]) => {
              const isPhoneNumberField = name === 'phoneNumber';

              return (
                <InputGroup 
                  key={name} 
                  flex="1" 
                  bg="transparent" 
                  backdropFilter="blur(5px)" 
                  mb={{ base: "10px", sm: "15px" }}
                  width={{ base: "220%", sm: "220%", md: "220%" }}
                  pb={isPhoneNumberField && isPhoneDropdownOpen ? "200px" : "0"}
                  zIndex={1}
                >
                  <Flex width="100%" position="relative">
                    <Box 
                      position="absolute" 
                      left={{ base: "2", sm: "3" }} 
                      top="50%" 
                      transform="translateY(-50%)" 
                      fontSize={{ base: 16, sm: 18, md: 20 }} 
                      {...(isPhoneNumberField ? { display: 'none' } : {})}
                      color="#36b0e2"
                      {...(name === 'phoneNumber' ? { display: 'none' } : {})}  
                >
                  <Icon />
                </Box>
                {isPhoneNumberField ? (
          <PhoneInput
            country={'tr'}
            value={formData.phoneNumber}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, phoneNumber: value }))
            }
            inputStyle={{
              width: '100%',
              height: '50px',
              fontSize: '16px',
              backgroundColor: 'transparent',
              border: '1px solid #36b0e2',
              borderRadius: '0.375rem',
              color: 'white',
              paddingLeft: '48px',
            }}
            buttonStyle={{
              backgroundColor: 'transparent',
              border: 'none',
              borderRight: '1px solid #36b0e2',
              borderRadius: '0.375rem 0 0 0.375rem',
            }}
            enableSearch={true}
            searchClass="phone-search-input"
            containerClass="phone-input-container"
            dropdownStyle={{
              backgroundColor: '#000A1C',
              color: 'white',
              border: '1px solid #36b0e2',
              position: 'fixed',
            }}
            searchStyle={{
              backgroundColor: '#000A1C',
              color: 'white',
              border: '1px solid #36b0e2',
            }}
            containerStyle={{
              width: '100%',
              position: 'relative',
            }}
          />
        ) : (
          <ChakraInput
            name={name}
            height={{ base: "40px", sm: "45px", md: "50px" }}
            width="100%"
            type={name === 'password' ? 'password' : 'text'}
            placeholder={placeholder}
            borderColor="#36b0e2"
            value={formData[name]}
            onChange={handleChange}
            pl={{ base: 8, sm: 10 }}
            fontSize={{ base: "14px", sm: "15px", md: "16px" }}
            _focus={{
              boxShadow: '0 0 0 1px #36b0e2',
              borderColor: '#36b0e2',
            }}
          />
        )}

                {name === 'password' && formData.password && formData.password.length < 6 && (
                  <Text color="red.500" fontSize="sm" mt={1} ml={1}>
                    Min 6 Character
                  </Text>
                )}
                </Flex>
              </InputGroup>
            )})
          }
            {registrationError && (
            <Box mb={4} textAlign="center" width="100%">
              <Text color="red.500" fontSize="sm">
                {registrationError}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {activeStep === 1 && environment.emailValidation && (
        <Box mt={{ base: "20px", sm: "30px", md: "40px" }} mb={{ base: "10px", sm: "15px", md: "20px" }}>
        <Text fontSize="lg" mb={4} color="white">
          We&apos;ve sent a verification code to {formData.email}
        </Text>

        {/* Doğrulama durumunu gösteren feedback alanı */}
        {verificationStatus !== 'idle' && (
          <Alert 
            status={verificationStatus} 
            borderRadius="md" 
            mb={4}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon boxSize="24px" mr={0} />
            <AlertTitle mt={2} mb={1}>
              {verificationStatus === 'success' ? 'Success!' : 'Error!'}
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {verificationMessage}
            </AlertDescription>
          </Alert>
        )}

        <InputGroup 
          flex="1" 
          bg="transparent" 
          backdropFilter="blur(5px)" 
          mb={4} 
          alignItems="center" 
          textAlign="center"
          maxW="100%"
          mx="auto"
        >
          <Flex 
            width="100%"
            maxW="100%"
            mx="auto"
            alignItems="center" 
            textAlign="center"
          >
            <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
              <FaEnvelope color="#36b0e2" />
            </Box>
            <ChakraInput
              name="verificationCode"
              placeholder="Enter verification code"
              height={{ base: "40px", sm: "45px", md: "50px" }}
              borderColor={
                isSuccess ? 'green.500' : 
                verifyError ? 'red.500' : '#36b0e2'
              }
              pl={{ base: 8, sm: 10 }}
              value={formData.verificationCode}
              onChange={(e) => {
                handleChange(e);
                // Kullanıcı tekrar yazmaya başladığında durumu sıfırla
                if (verificationStatus !== 'idle') {
                  setVerificationStatus('idle');
                  setVerificationMessage('');
                  setVerifyError('');
                  setIsSuccess(false);
                }
              }}
              fontSize={{ base: "14px", sm: "15px", md: "16px" }}
              _focus={{ 
                borderColor: isSuccess ? 'green.500' : 
                            verifyError ? 'red.500' : '#36b0e2',
                boxShadow: isSuccess ? '0 0 0 1px green.500' : 
                          verifyError ? '0 0 0 1px red.500' : '0 0 0 1px #36b0e2'
              }}
            />
          </Flex>
        </InputGroup>

        <Flex 
          gap={2} 
          direction={{ base: "column", sm: "row" }}
          alignItems={{ base: "flex-start", sm: "center" }}
        >
          <Button
            onClick={handleVerify}
            colorScheme={isSuccess ? 'green' : 'blue'}
            width="100%"
            loading={loading}
            loadingText="Verifying..."
            mb={4}
            disabled={isSuccess}
          >
            {verificationStatus === 'success' ? 'Verified!' : 'Verify'}
          </Button>
          
          <Button
            onClick={async () => {
              setLoading(true);
              await sendEmailCode();
              setLoading(false);
            }}
            variant="ghost"
            color="blue.400"
            fontSize={{ base: "xs", sm: "sm" }}
            _hover={{ color: '#36b0e2' }}
            loading={loading}
            loadingText="Sending..."
          >
            Resend code
          </Button>
        </Flex>
      </Box>
    )}

      <Flex 
        mt={{ base: 4, sm: 5, md: 6 }} 
        gap={{ base: 3, sm: 4 }}
        direction={{ base: "column", sm: "row" }}
        width="100%"
      >
        {activeStep > 0 && (
          <CustomButton
            borderColor="#36b0e2"
            onClick={goToPrevious}
            variant="outline"
            arrowDirection="left"
            pl={{ base: 3, sm: 5 }}
            width={{ base: "100%", sm: "auto" }}
            {...styles.outline}
          >
            <Text textAlign="center">Back</Text>
          </CustomButton>
        )}
        {activeStep === 0 && (
          <CustomButton
            onClick={handleNext}
            loading={loading}
            loadingText='Processing...'
            width="100%"
            mt={{ base: 2, sm: -5 }}
          >
            Next
          </CustomButton>
        )}
      </Flex>
    </Box>
  </Flex>
  );
}