import {
  Box,
  InputGroup,
  Input as ChakraInput,
  StackProps,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';

import { useToast } from '@chakra-ui/toast';
import { useSteps } from '@chakra-ui/stepper';
import { LuLock } from 'react-icons/lu';
import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import CustomButton from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { environment } from '@/app/config/environment';


interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  verificationCode: string;
  [key: string]: string;
}

function RegisterInput(props: StackProps) {
  const router = useRouter();
  const toast = useToast();
  const { activeStep, goToNext, goToPrevious } = useSteps({ index: 0 });
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    verificationCode: ''
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      // Sadece rakamları al
      const numericValue = value.replace(/[^0-9]/g, '');
      // Maximum 10 rakam
      const truncatedValue = numericValue.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: truncatedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    if (activeStep === 0) {
      if (!formData.name || !formData.email || !formData.phoneNumber || !formData.password) {
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

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
        toast({
          title: 'Error',
          description: 'Please enter a valid phone number (10 digits)',
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
    } else {
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

  const sendSmsCode = async () => {
    setIsSendingSms(true);
    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/Verification/SendSms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS code');
      }

      toast({
        title: 'SMS code sent',
        description: 'Please check your phone',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending SMS code:', error);
      toast({
        title: 'Error',
        description: 'Failed to send SMS code. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSendingSms(false);
    }
  };

  const sendEmailCode = async () => {
    try {
      const response = await fetch(`${environment.apiUrl}/api/Verification/SendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email code');
      }

      toast({
        title: 'Email code sent',
        description: 'Please check your email',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending email code:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email code. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  interface RegisterApiResponse {
    data: string[];
    isSuccess: boolean;
    errors: string[];
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/User/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.name, // Name'i surname olarak da kullan
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data: RegisterApiResponse = await response.json();
      console.log('API Response:', data);

      if (response.ok && data.isSuccess) {
        // Store API response and email in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userEmail', formData.email);
        console.log('User data stored:', data);
        console.log('Email stored:', formData.email);

        toast({
          title: 'Success',
          description: 'Registration successful!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        if (!environment.emailValidation && !environment.smsValidation) {
          router.push('/dashboard');
        } else {
          goToNext();
        }
      } else {
        throw new Error(data.errors?.[0] || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  type InputField = [string, string, React.ComponentType];

  const inputFields: InputField[] = [
    ['name', 'Name', FaUser],
    ['email', 'Email', FaEnvelope],
    ['phoneNumber', 'Phone Number', FaPhone],
    ['password', 'Password', LuLock], 
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
    borderRadius={{ base: "8px", sm: "10px" }}  
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
          {inputFields.map(([name, placeholder, Icon]) => (
            <InputGroup 
              key={name} 
              flex="1" 
              bg="transparent" 
              backdropFilter="blur(5px)" 
              mb={{ base: "10px", sm: "15px" }}
              width={{ base: "220%", sm: "220%", md: "220%" }}
            >
              <Flex width="100%">
                <Box 
                  position="absolute" 
                  left={{ base: "2", sm: "3" }} 
                  top="50%" 
                  transform="translateY(-50%)" 
                  zIndex={1} 
                  fontSize={{ base: 16, sm: 18, md: 20 }} 
                  color="#36b0e2"
                >
                  <Icon />
                </Box>
                <ChakraInput
                  name={name}
                  height={{ base: "40px", sm: "45px", md: "50px" }}
                  width="100%"
                  type={name === 'password' ? 'password' : name === 'phoneNumber' ? 'tel' : 'text'}
                  placeholder={placeholder}
                  borderColor="#36b0e2"
                  value={formData[name]}
                  onChange={handleChange}
                  onKeyDown={name === 'phoneNumber' ? handleKeyPress : undefined}
                  pl={{ base: 8, sm: 10 }}
                  fontSize={{ base: "14px", sm: "15px", md: "16px" }}
                  _focus={{ 
                    boxShadow: '0 0 0 1px #36b0e2',
                    borderColor: '#36b0e2'
                  }}
                />
                </Flex>
              </InputGroup>
            ))}
        </Box>
      )}

      {activeStep === 1 && environment.smsValidation && (
        <Box mt={{ base: "20px", sm: "30px", md: "40px" }} mb={{ base: "10px", sm: "15px", md: "20px" }}>
          <Text fontSize="lg" mb={4} color="white">
            We&apos;ve sent a verification code to {formData.phoneNumber}
          </Text>
            
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
              <FaPhone color="#36b0e2" />
            </Box>
            <ChakraInput
              name="verificationCode"
              placeholder="SMS Verification Code"
              height={{ base: "40px", sm: "45px", md: "50px" }}
              borderColor="#36b0e2"
              pl={{ base: 8, sm: 10 }}
              value={formData.verificationCode}
              onChange={handleChange}
              fontSize={{ base: "14px", sm: "15px", md: "16px" }}
              _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
            />
            </Flex>
          </InputGroup>

          <Flex 
            gap={2} 
            direction={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <Button
              onClick={sendSmsCode}
              loading={isSendingSms}
              variant="outline"
              colorScheme="blue"
              _hover={{
                borderColor: '#36b0e2',
                boxShadow: '0 0 0 1px #36b0e2'
              }}
            >
              Resend Code
            </Button>
            <Text 
              color="gray.400" 
              fontSize={{ base: "xs", sm: "sm" }} 
              alignSelf={{ base: "flex-start", sm: "center" }}
              textAlign={{ base: "left", sm: "center" }}
            >
              Didn&apos;t receive code? Wait 60 seconds before requesting again.
            </Text>
          </Flex>
        </Box>
      )}

      {activeStep === 2 && environment.emailValidation && (
        <Box mt={{ base: "20px", sm: "30px", md: "40px" }} mb={{ base: "10px", sm: "15px", md: "20px" }}>
          <Text fontSize="lg" mb={4} color="white">
            We&apos;ve sent a verification code to {formData.email}
          </Text>
            
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
              placeholder="Email Verification Code"
              height={{ base: "40px", sm: "45px", md: "50px" }}
              borderColor="#36b0e2"
              pl={{ base: 8, sm: 10 }}
              value={formData.verificationCode}
              onChange={handleChange}
              fontSize={{ base: "14px", sm: "15px", md: "16px" }}
              _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
            />
            </Flex>
          </InputGroup>

          <Flex 
            gap={2} 
            direction={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
          >
            <Button
              onClick={sendEmailCode}
              loading={loading}
              variant="outline"
              colorScheme="blue"
              _hover={{
                borderColor: '#36b0e2',
                boxShadow: '0 0 0 1px #36b0e2'
              }}
            >
              Resend Code
            </Button>
            <Text 
              color="gray.400" 
              fontSize={{ base: "xs", sm: "sm" }} 
              alignSelf={{ base: "flex-start", sm: "center" }}
              textAlign={{ base: "left", sm: "center" }}
            >
              Didn&apos;t receive code? Wait 60 seconds before requesting again.
            </Text>
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
        <CustomButton
          onClick={handleRegister}
          loading={loading}
          loadingText="Registering..."
          width="100%"
          mt={{ base: 2, sm: -5 }}
          style={styles.solid}
        >
          Register
        </CustomButton>
      </Flex>
    </Box>
  </Flex>
  );
}

export default RegisterInput;