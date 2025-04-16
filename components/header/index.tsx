'use client'

import { Box, Flex, Grid, Text, IconButton, useDisclosure, Stack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import Btn from '../ui/button'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

function Header() {
  const router = useRouter();
  const { open: isOpen, onToggle } = useDisclosure();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);

  if (pathname === "/admin") {
    return null;
  }
  
  return (
    <Box as="header" 
    bg="transparent"
    backdropFilter="blur(5px)"
    color="white" 
    borderRadius={{ base: '0', md: '16px' }}
    px={{ base: 2, sm: 4, md: 6, lg: 8 }}
    py={{ base: 2, md: 4 }}
    mx={{ base: 0, md: 4, lg: 40 }}
    justifyContent="space-between"
    position="fixed"
    top={0}
    left={0}
    right={0}
    zIndex={1000}>
      {/* Desktop Header */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={6}
        alignItems="center"
        maxW="1400px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        display={{ base: 'none', md: 'grid' }}
      >
        <Flex gap={{ base: 3, md: 5 }} alignItems="center" mt={{ base: 0, md: 8 }}>
          <Link href="/">
            <Image 
              src="/images/logo.png"
              alt="Logo"
              width={70}
              height={70}
              style={{ width: 'auto', height: 'auto' }} sizes="(min-width: 768px) 70px, 50px" className="responsive-logo" /> 
          </Link> 
          <Text fontSize={{ base: '20px', sm: '24px', md: '32px', lg: '36px' }} fontWeight={500}>Intifinex</Text>
        </Flex>

        <Flex 
          justifyContent="space-between" 
          alignItems="center"
          fontWeight={300}
          fontSize={{ md: 'sm', lg: 'md' }}
          mt={8}
        >
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
        </Flex>

        <Box textAlign="right" mt={8}>
          <Btn 
            buttonText={isLoggedIn ? "Dashboard" : "Register"} 
            onClick={() => router.push(isLoggedIn ? '/dashboard' : '/register')} 
          />
        </Box>
      </Grid>

      {/* Mobile Header */}
      <Flex
        display={{ base: 'flex', md: 'none' }}
        justifyContent="space-between"
        alignItems="center"
        p={4}
      >
        <Flex gap={3} alignItems="center">
          <Link href="/">
          <Image 
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '40px',
              maxHeight: '40px'
            }}
          />
          </Link>
          <Text fontSize={{ base: '18px', sm: '24px' }} fontWeight={500}>Intifinex</Text>
        </Flex>

        <IconButton
          aria-label="Toggle navigation"
          onClick={onToggle}
          variant="ghost"
        >
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </IconButton>
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Box p={4} display={{ md: 'none' }}>
          <Stack 
            direction="column" 
            gap={6} 
            height="auto" 
            width={{ base: '80%', sm: '60%', md: '50%' }} 
            position="fixed" 
            top="65px" 
            left="50%" 
            transform="translateX(-50%)"
            zIndex={9999} 
            bg="rgba(0, 0, 0, 0.8)" 
            border="1px solid #36B0E2" 
            borderRadius={10} 
            backdropFilter="blur(10px)" 
            padding={{ base: '20px', sm: '30px' }}
            marginTop={2}
          >
            <Link href="/" onClick={onToggle} style={{ marginTop: 20 }}>Home</Link>
            <Link href="/features" onClick={onToggle}>Features</Link>
            <Link href="/about" onClick={onToggle}>About</Link>
            <Link href="/contact" onClick={onToggle}>Contact</Link>
            <Link href="/faq" onClick={onToggle}>FAQ</Link>
            <Box>
              <Btn 
                buttonText={isLoggedIn ? "Dashboard" : "Register"} 
                onClick={() => router.push(isLoggedIn ? '/dashboard' : '/register')} 
                width="full" 
              />
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Header