'use client'

import { Box, Flex } from '@chakra-ui/react';
import React from 'react'
import RegisterInput from '../ui/registerInput';

function Register() {
  return (
    <Flex overflow="hidden" position="relative" height="100vh" alignItems="center" justifyContent="center">
      <Box position="absolute" width="100%" height="100%">
      </Box>
      <Box zIndex={1} textAlign="center" p={8} borderRadius="md" boxShadow="lg">
        <RegisterInput />
      </Box>
    </Flex>
  );
}

export default Register;