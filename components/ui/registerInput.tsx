import {
  Box,
  InputGroup,
  Input as ChakraInput,
  StackProps,
  Flex,
  Image,
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
import { withMask } from 'use-mask-input';
import { environment } from '@/app/config/environment';

interface FormData {
  name: string;
  surname: string;
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);



  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: '',
    verificationCode: ''
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (activeStep === 0) {
      return ['name', 'surname', 'email', 'phoneNumber', 'password']
        .every(field => formData[field].trim() !== '');
    }
    return formData.verificationCode.trim() !== '';
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
    setIsSendingEmail(true);
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
    } finally {
      setIsSendingEmail(false);
    }
  };

  const verifySmsCode = async () => {
    setIsVerifyingSms(true);
    try {
      const response = await fetch(`${environment.apiUrl}/api/Verification/ValidateSmsCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          code: formData.verificationCode
        }),
      });

      if (!response.ok) {
        throw new Error('SMS verification failed');
      }

      if (environment.emailValidation) {
        goToNext();
        await sendEmailCode();
      } else {
        // If email validation is disabled, proceed with registration
        await handleRegister();
      }
    } catch (error) {
      console.error('Error verifying SMS code:', error);
      toast({
        title: 'Error',
        description: 'SMS verification failed. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsVerifyingSms(false);
    }
  };

  const verifyEmailCode = async () => {
    setIsVerifyingEmail(true);
    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/Verification/ValidateEmailCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode
        }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      await handleRegister();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Email verification failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    try {
      // Kayıt işlemini yap
      const response = await fetch('https://intfinex.azurewebsites.net/api/User/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Registration successful!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        goToNext(); // Sadece başarılı olursa bir sonraki adıma geç
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
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
  };
  
  const handleRegister = async () => {
    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/User/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data: RegisterApiResponse = await response.json();
      console.log('Gelen veri:', data);

      if (response.ok && data.isSuccess) {
        // Store API response and email in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('userEmail', formData.email);
        console.log('Kullanıcı verisi:', data);
        console.log('Email kaydedildi:', formData.email);

        if (data.isSuccess) {
          toast({
            title: 'Success',
            description: 'Registration successful',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          if (!environment.emailValidation && !environment.smsValidation) {
            router.push('/');
          } else {
            router.push('/email-verification');
          }
        } else {
          throw new Error(data.errors?.[0] || 'Registration failed');
        }
      } else {
        throw new Error(data.errors?.[0] || 'Registration failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  type InputField = [string, string, React.ComponentType];

  const inputFields: InputField[] = [
    ['name', 'Name', FaUser],
    ['surname', 'Surname', FaUser],
    ['email', 'Email', FaEnvelope]
  ];

  const styles = {
  solid: {
    bg: "#36b0e2",
    color: "#ffffff",
    _hover: {
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
      color: "#ffffff",
      transform: "translateX(5px)",
    }
  }
};

return (
  <Flex justifyContent="space-between" alignItems="center" width="1500px" bg="rgba(0, 0, 0, 0.1)" padding="10px 40px" borderRadius="10px" backdropFilter="blur(5px)" {...props}>
    <Box width="60%">
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color="white"
        mb={6}
        background="linear-gradient(to right, #ffffff, #36b0e2)"
        backgroundClip="text"
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Sign Up
      </Text>
      {activeStep === 0 && (
        <Box mt="20px" display="grid" gridTemplateColumns="repeat(2, 1fr)" width="100%" gap="20px">
          {inputFields.map(([name, placeholder, Icon]) => (
            <InputGroup key={name} flex="1" bg="transparent" backdropFilter="blur(5px)" mb="15px">
              <Flex width="100%">
                <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex={1} fontSize={20} color="#36b0e2">
                  <Icon />
                </Box>
                <ChakraInput
                  name={name}
                  height={50}
                  placeholder={placeholder}
                  borderColor="#36b0e2"
                  value={formData[name]}
                  onChange={handleChange}
                  pl={10}
                  _focus={{ 
                    boxShadow: '0 0 0 1px #36b0e2',
                    borderColor: '#36b0e2'
                  }}
                  width={400}
                />
                </Flex>
              </InputGroup>
            ))}

            <InputGroup flex="1" bg="transparent" backdropFilter="blur(5px)" mb="15px">
              <Flex width="100%">
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                <FaPhone color="#36b0e2" />
              </Box>
              <ChakraInput
                name="phoneNumber"
                placeholder="Phone Number"
                height={50}
                pl={10}
                borderColor="#36b0e2"
                ref={(el) => withMask('(999) 999-9999')(el)}
                value={formData.phoneNumber}
                onChange={handleChange}
                _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
                width={400}
              />
              </Flex>
            </InputGroup>

            <InputGroup flex="1" bg="transparent" backdropFilter="blur(5px)" mt="-15px">
              <Flex width="100%">
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                <LuLock color="#36b0e2" />
              </Box>
              <ChakraInput 
                name="password"
                type="password"
                placeholder="Password"
                pl={10}
                height={50}
                borderColor="#36b0e2"
                value={formData.password}
                onChange={handleChange}
                _focus={{ 
                  boxShadow: '0 0 0 1px #36b0e2',
                  borderColor: '#36b0e2'
                }}
                width={400}
              />
              </Flex>
            </InputGroup>
          </Box>
        )}

        {activeStep === 1 && environment.smsValidation && (
          <Box mt="40px" mb="20px">
            <Text fontSize="lg" mb={4} color="white">
              We&apos;ve sent a verification code to {formData.phoneNumber}
            </Text>
            
            <InputGroup flex="1" bg="transparent" backdropFilter="blur(5px)" mb={4} alignItems="center" textAlign="center">
              <Flex width="50%" alignItems="center" textAlign="center">
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                <FaPhone color="#36b0e2" />
              </Box>
              <ChakraInput
                name="verificationCode"
                placeholder="SMS Verification Code"
                height={50}
                borderColor="#36b0e2"
                pl={10}
                value={formData.verificationCode}
                onChange={handleChange}
                _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
              />
              </Flex>
            </InputGroup>

            <Flex gap={2}>
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
              <Text color="gray.400" fontSize="sm" alignSelf="center">
                Didn&apos;t receive code? Wait 60 seconds before requesting again.
              </Text>
            </Flex>
          </Box>
        )}

        {activeStep === 2 && environment.emailValidation && (
          <Box mt="40px" mb="20px">
            <Text fontSize="lg" mb={4} color="white">
              We&apos;ve sent a verification code to {formData.email}
            </Text>
            
            <InputGroup flex="1" bg="transparent" backdropFilter="blur(5px)" mb={4} alignItems="center" textAlign="center">
              <Flex width="50%" alignItems="center" textAlign="center">
              <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                <FaEnvelope color="#36b0e2" />
              </Box>
              <ChakraInput
                name="verificationCode"
                placeholder="Email Verification Code"
                height={50}
                borderColor="#36b0e2"
                pl={10}
                value={formData.verificationCode}
                onChange={handleChange}
                _focus={{ borderColor: '#36b0e2', boxShadow: '0 0 0 1px #36b0e2' }}
              />
              </Flex>
            </InputGroup>

            <Flex gap={2}>
              <Button
                onClick={sendEmailCode}
                loading={isSendingEmail}
                variant="outline"
                colorScheme="blue"
                _hover={{
                  borderColor: '#36b0e2',
                  boxShadow: '0 0 0 1px #36b0e2'
                }}
              >
                Resend Code
              </Button>
              <Text color="gray.400" fontSize="sm" alignSelf="center">
                Didn&apos;t receive code? Wait 60 seconds before requesting again.
              </Text>
            </Flex>
          </Box>
        )}

        <Flex mt={6} gap={4}>
          {activeStep > 0 && (
            <CustomButton
              borderColor="#36b0e2"
              onClick={goToPrevious}
              variant="outline"
              arrowDirection="left"
              pl={5}
              {...styles.outline}
            >
              <Text textAlign="center">Back</Text>
            </CustomButton>
          )}
          <CustomButton
            onClick={activeStep === 0 ? handleNext : (activeStep === 1 ? verifySmsCode : verifyEmailCode)}
            loading={activeStep === 1 ? isVerifyingSms : (activeStep === 2 ? isVerifyingEmail : false)}
            {...styles.solid}
          >
            {activeStep === 0 ? 
              (!environment.smsValidation && !environment.emailValidation ? 'Verify & Register' : 'Next')
              : (activeStep === 1 ? 'Verify SMS' : 'Verify & Register')}
          </CustomButton>
        </Flex>
      </Box>

      <Box width="35%" display="flex" alignItems="center" justifyContent="center">
        <Image src="/images/6256878.jpg" alt="Register" width="100%" />
      </Box>
    </Flex>
  );
}

export default RegisterInput;