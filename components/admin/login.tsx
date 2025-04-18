import React, { useState } from 'react';
import { Box, Text, Input as ChakraInput, Flex } from '@chakra-ui/react';
import Btn from '@/components/ui/button';
import { useToast } from '@chakra-ui/toast';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://intfinex.azurewebsites.net/api/Admin/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });
  
      const result = await response.json();
      console.log('[AdminLogin] API raw result:', result);
  
      if (response.ok && result.isSuccess) {
        // Sadece admin flag'ini set et
        localStorage.setItem('adminAuthenticated', 'true');
        console.log('[AdminLogin] adminAuthenticated set edildi');
  
        setSuccess('Login successful. Welcome, admin!');
        setError('');
  
        toast({
          title: 'Giriş başarılı',
          description: "Hoş geldiniz, admin!",
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
  
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error('[AdminLogin] Login başarısız:', result);
        setError('Invalid password');
      }
    } catch (err) {
      console.error('[AdminLogin] Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="transparent" backdropFilter="blur(5px)">
      <Box p={8} rounded="lg" shadow="md" w="96">
        <Text fontSize="2xl" mb={6} textAlign="center">
          Admin Login
        </Text>
        <form onSubmit={handleLogin}>
          <Box mb={4}>
            <ChakraInput
            border="1px solid #36b0e2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              variant="outline"
            />
          </Box>
          {error && (
            <Text color="red.500" fontSize="sm" mb={4}>
              {error}
            </Text>
          )}
          {success && (
            <Text color="green.500" fontSize="sm" mb={4}>
              {success}
            </Text>
          )}
          <Btn
            type="submit"
            buttonText="Login"
            w="full"
          />
        </form>
      </Box>
    </Flex>
  );
};

export default AdminLogin;
