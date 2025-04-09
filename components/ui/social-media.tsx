import { Box, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaX } from 'react-icons/fa6'

function SocialMedia() {
  return (
    <Flex flexDirection="column" gap={5}>
        <Box fontSize={25} color="#36b0e2">
            <Link href="https://wa.me/905555555555">
                <FaWhatsapp />
            </Link>
        </Box>
        <Box fontSize={25} color="#36b0e2">
            <Link href="https://www.instagram.com/intfinex/">
                <FaInstagram />
            </Link>
        </Box>
        <Box fontSize={25} color="#36b0e2">
            <Link href="https://www.linkedin.com/company/intfinex/">
                <FaLinkedin />
            </Link>
        </Box>
        <Box fontSize={25} color="#36b0e2">
            <Link href="https://x.com/intfinex">
                <FaX />
            </Link>
        </Box>
        <Box fontSize={25} color="#36b0e2">
            <Link href="https://www.facebook.com/intfinex">
                <FaFacebook />
            </Link>
        </Box>
    </Flex>
  )
}

export default SocialMedia
