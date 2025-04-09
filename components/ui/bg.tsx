import { Box } from '@chakra-ui/react'
import { keyframes } from "@chakra-ui/system"
import React from 'react'
import { FaBitcoin, FaEthereum, FaDollarSign, FaEuroSign, FaChartLine, FaGem } from 'react-icons/fa6';
import { SiBinance, SiSolana } from 'react-icons/si';

function Background() {

  const getGlowAnimation = (minSize: number, maxSize: number) => keyframes`
    0% { box-shadow: 0 0 ${minSize}px #36b0e2; }
    50% { box-shadow: 0 0 ${maxSize}px #36b0e2; }
    100% { box-shadow: 0 0 ${minSize}px #36b0e2; }
  `;

  const glowAnimationBase = getGlowAnimation(3, 30);
  const glowAnimationSm = getGlowAnimation(4, 40);
  const glowAnimationMd = getGlowAnimation(5, 50);

  const commonStyles = {
    position: "absolute" as const,
    borderRadius: "50%",
    border: "1px solid #36b0e2",
  };

  const getCircleAnimation = (distance: string) => keyframes`
  0% { transform: rotate(0deg) translateX(${distance}) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(${distance}) rotate(-360deg); }
`;

const getResponsiveAnimation = (baseDist: number) => {
    const mobileDist = Math.floor(baseDist * 0.7);
    const tabletDist = Math.floor(baseDist * 0.85);
    return {
      base: getCircleAnimation(`${mobileDist}px`),
      sm: getCircleAnimation(`${tabletDist}px`),
      md: getCircleAnimation(`${baseDist}px`)
    };
  };

const circleAnimation1 = getResponsiveAnimation(140);
const circleAnimation2 = getResponsiveAnimation(-140);
const circleAnimation3 = getResponsiveAnimation(220);
const circleAnimation4 = getResponsiveAnimation(-220);
const circleAnimation5 = getResponsiveAnimation(300);
const circleAnimation6 = getResponsiveAnimation(-300);
const circleAnimation7 = getResponsiveAnimation(380);
const circleAnimation8 = getResponsiveAnimation(-380);

  return (
    <Box 
      position="absolute" 
      top={{ base: "30%", md: "20%" }} 
      left="50%" 
      transform="translateX(-50%)"
    >
        <Box
          position="relative"
          width={{ base: "300px", sm: "350px", md: "400px" }}
          height={{ base: "300px", sm: "350px", md: "400px" }}
          _before={{
            ...commonStyles,
            content: '""',
            inset: '60px',
            opacity: 0.5,
            animation: { 
              base: `${glowAnimationBase} 4s ease-in-out infinite`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite`,
              md: `${glowAnimationMd} 4s ease-in-out infinite`
            },
          }}
          _after={{
            ...commonStyles,
            content: '""',
            inset: '-20px',
            opacity: 0.4,
            animation: { 
              base: `${glowAnimationBase} 4s ease-in-out infinite 0.5s`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite 0.5s`,
              md: `${glowAnimationMd} 4s ease-in-out infinite 0.5s`
            },
          }}
        >
            <Box 
                position="absolute"
                top="46%"
                left="46%"
                transform="translate(100%, 100%)"
                animation={{ 
                base: `${circleAnimation2.base} 8s linear infinite`,
                sm: `${circleAnimation2.sm} 8s linear infinite`,
                md: `${circleAnimation2.md} 8s linear infinite`
              }}
                opacity={0.5}
            >
                 <Box display="block">
                  <FaBitcoin size="35" />
                </Box>
            </Box>
          <Box
            {...commonStyles}
            display={{ base: "none", md: "block" }}
            opacity={0.3}
            animation={{ 
              base: `${glowAnimationBase} 4s ease-in-out infinite 1s`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite 1s`,
              md: `${glowAnimationMd} 4s ease-in-out infinite 1s`
            }}
          />
          <Box 
            position="absolute" 
            top="46%" 
            left="46%" 
            animation={{ 
                base: `${circleAnimation1.base} 8s linear infinite`,
                sm: `${circleAnimation1.sm} 8s linear infinite`,
                md: `${circleAnimation1.md} 8s linear infinite`
              }} 
            opacity={0.5}
          >
             <Box display="block">
              <FaEthereum size="35" />
            </Box>
          </Box>

          <Box
            {...commonStyles}
            display={{ base: "none", md: "block" }}
            inset="-100px"
            opacity={0.2}
            animation={{ 
              base: `${glowAnimationBase} 4s ease-in-out infinite 1.5s`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite 1.5s`,
              md: `${glowAnimationMd} 4s ease-in-out infinite 1.5s`
            }}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation3.base} 7s linear infinite`,
                sm: `${circleAnimation3.sm} 7s linear infinite`,
                md: `${circleAnimation3.md} 7s linear infinite`
              }}
            opacity={0.4}
          >
            <Box display="block">
              <FaDollarSign size="35" />
            </Box>
          </Box>
          <Box
            {...commonStyles}
            display={{ base: "none", lg: "block" }}
            inset="-180px"
            opacity={0.1}
            animation={{ 
              base: `${glowAnimationBase} 4s ease-in-out infinite 2s`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite 2s`,
              md: `${glowAnimationMd} 4s ease-in-out infinite 2s`
            }}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation4.base} 7s linear infinite`,
                sm: `${circleAnimation4.sm} 7s linear infinite`,
                md: `${circleAnimation4.md} 7s linear infinite`
              }}
            opacity={0.4}
          >
            <Box display="block">
              <FaEuroSign size="35" />
            </Box>
          </Box> 
          <Box
            {...commonStyles}
            display={{ base: "none", xl: "block" }}
            inset="-260px"
            opacity={0.05}
            animation={{ 
              base: `${glowAnimationBase} 4s ease-in-out infinite 2.5s`,
              sm: `${glowAnimationSm} 4s ease-in-out infinite 2.5s`,
              md: `${glowAnimationMd} 4s ease-in-out infinite 2.5s`
            }}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation5.base} 6s linear infinite`,
                sm: `${circleAnimation5.sm} 6s linear infinite`,
                md: `${circleAnimation5.md} 6s linear infinite`
              }}
            opacity={0.3}
          >
            <Box display={{ base: "none", md: "block" }}>
              <SiBinance size="35" />
            </Box>
          </Box>
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation6.base} 6s linear infinite`,
                sm: `${circleAnimation6.sm} 6s linear infinite`,
                md: `${circleAnimation6.md} 6s linear infinite`
              }}
            opacity={0.3}
          >
            <Box display={{ base: "none", md: "block" }}>
              <FaChartLine size="35" />
            </Box>
          </Box> 
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation7.base} 5s linear infinite`,
                sm: `${circleAnimation7.sm} 5s linear infinite`,
                md: `${circleAnimation7.md} 5s linear infinite`
              }}
            opacity={0.2}
          >
            <Box display={{ base: "none", "2xl": "block" }}>
              <SiSolana size="35" />
            </Box>
          </Box>
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={{ 
                base: `${circleAnimation8.base} 5s linear infinite`,
                sm: `${circleAnimation8.sm} 5s linear infinite`,
                md: `${circleAnimation8.md} 5s linear infinite`
              }}
            opacity={0.2}
          >
            <Box display={{ base: "none", "2xl": "block" }}>
              <FaGem size="35" />
            </Box> 
          </Box>
        </Box>
      </Box>
  )
}

export default Background
