import React from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import ContactSection from '../ui/contactSection'

function ContactUs() {
  return (
    <Grid
      templateColumns="1fr"
      gap={{ base: 4, md: 6 }}
      alignItems="center"
      maxW="1400px"
      mx="auto"
      px={{ base: 4, md: 6, lg: 8 }}
      mt={{ base: 60, md: 100 }}
    >
        <Box textAlign="center">
            <Text
              fontSize={{ base: '24px', sm: '28px', md: '40px', lg: '48px' }}
              fontWeight="bold"
              lineHeight={{ base: 1.2, md: 1.4 }}
            >
                Get in Touch with Us
            </Text>
            <Text
              fontSize={{ base: 16, md: 18 }}
              color="gray.300"
              mt={{ base: 2, md: 4 }}
              px={{ base: 2, md: 0 }}
            >
              If you have any questions, suggestions, or need support, our team is here to assist you. Reach out to us and we&apos;ll get back to you as soon as possible.
            </Text>
        </Box>
        <Box mt={{ base: 30, md: 50 }}>
            <ContactSection />
        </Box>
    </Grid>
  )
}
export default ContactUs
