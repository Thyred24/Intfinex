import { Box, Flex, Text, Link, Icon, Stack } from '@chakra-ui/react';
import { FaTwitter, FaDiscord, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

const Footer = () => {

  const pathname = usePathname();

  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <Box 
      bg="linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
      color="white"
      py={12}
      px={{ base: 4, md: 8, lg: 16 }}
      mt={100}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="flex-start"
        maxW="1200px"
        mx="auto"
      >
        {/* Logo & Description */}
        <Box mb={{ base: 8, md: 0 }} maxW="300px">
          <Text fontSize="2xl" fontWeight="bold" mb={2} bgGradient="linear(to-r, #36B0E2, #E56006)" bgClip="text">
            Intfinex
          </Text>
          <Text color="gray.400" fontSize="sm">
            Empowering your financial future with smart trading solutions and innovative tools.
          </Text>
        </Box>

        {/* Links Sections */}
        <Flex 
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 8, md: 16 }}
        >
          {/* Quick Links */}
          <Stack>
            <Text fontWeight="bold" color="#36B0E2">Quick Links</Text>
            <Link href="/about" color="gray.400" _hover={{ color: "#E56006" }}>About Us</Link>
            <Link href="/features" color="gray.400" _hover={{ color: "#E56006" }}>Features</Link>
            <Link href="/pricing" color="gray.400" _hover={{ color: "#E56006" }}>Pricing</Link>
            <Link href="/blog" color="gray.400" _hover={{ color: "#E56006" }}>Blog</Link>
          </Stack>

          {/* Support */}
          <Stack>
            <Text fontWeight="bold" color="#36B0E2">Support</Text>
            <Link href="/contact" color="gray.400" _hover={{ color: "#E56006" }}>Contact Us</Link>
            <Link href="/faq" color="gray.400" _hover={{ color: "#E56006" }}>FAQ</Link>
            <Link href="/privacy" color="gray.400" _hover={{ color: "#E56006" }}>Privacy Policy</Link>
            <Link href="/terms" color="gray.400" _hover={{ color: "#E56006" }}>Terms of Service</Link>
          </Stack>

          {/* Social Media */}
          <Stack>
            <Text fontWeight="bold" color="#36B0E2">Connect</Text>
            <Flex gap={4}>
              <Link href="https://twitter.com" target="_blank">
                <Icon as={FaTwitter} boxSize={5} color="gray.400" _hover={{ color: "#1DA1F2" }} />
              </Link>
              <Link href="https://discord.com" target="_blank">
                <Icon as={FaDiscord} boxSize={5} color="gray.400" _hover={{ color: "#5865F2" }} />
              </Link>
              <Link href="https://github.com" target="_blank">
                <Icon as={FaGithub} boxSize={5} color="gray.400" _hover={{ color: "white" }} />
              </Link>
              <Link href="https://linkedin.com" target="_blank">
                <Icon as={FaLinkedin} boxSize={5} color="gray.400" _hover={{ color: "#0077B5" }} />
              </Link>
            </Flex>
            <Flex align="center" color="gray.400" _hover={{ color: "#E56006" }}>
              <Icon as={FiMail} mr={2} />
              <Link href="mailto:info@intfinex.com">info@intfinex.com</Link>
            </Flex>
          </Stack>
        </Flex>
      </Flex>

      {/* Copyright */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        maxW="1200px"
        mx="auto"
        pt={4}
      >
        <Text color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} Intfinex. All rights reserved.
        </Text>
        <Flex gap={6} mt={{ base: 4, md: 0 }}>
          <Link href="/privacy" color="gray.500" fontSize="sm" _hover={{ color: "#E56006" }}>
            Privacy Policy
          </Link>
          <Link href="/terms" color="gray.500" fontSize="sm" _hover={{ color: "#E56006" }}>
            Terms of Service
          </Link>
          <Link href="/cookies" color="gray.500" fontSize="sm" _hover={{ color: "#E56006" }}>
            Cookie Policy
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;