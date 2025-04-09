import { Box } from '@chakra-ui/react'
import { keyframes } from "@chakra-ui/system"
import React from 'react'
import { FaBitcoin, FaEthereum, FaDollarSign, FaEuroSign, FaChartLine, FaGem } from 'react-icons/fa6';
import { SiBinance, SiSolana } from 'react-icons/si';

function Background() {

    const glowAnimation = keyframes`
    0% { box-shadow: 0 0 5px #36b0e2; }
    50% { box-shadow: 0 0 50px #36b0e2; }
    100% { box-shadow: 0 0 5px #36b0e2; }
  `;

  const commonStyles = {
    position: "absolute" as const,
    borderRadius: "50%",
    border: "1px solid #36b0e2",
  };

  const circleAnimation1 = keyframes`
  0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
`;

const circleAnimation2 = keyframes`
  0% { transform: rotate(0deg) translateX(-140px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(-140px) rotate(-360deg); }
`;

const circleAnimation3 = keyframes`
  0% { transform: rotate(0deg) translateX(220px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(220px) rotate(-360deg); }
`;

const circleAnimation4 = keyframes`
  0% { transform: rotate(0deg) translateX(-220px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(-220px) rotate(-360deg); }
`;

const circleAnimation5 = keyframes`
  0% { transform: rotate(0deg) translateX(300px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(300px) rotate(-360deg); }
`;

const circleAnimation6 = keyframes`
  0% { transform: rotate(0deg) translateX(-300px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(-300px) rotate(-360deg); }
`;

const circleAnimation7 = keyframes`
  0% { transform: rotate(0deg) translateX(380px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(380px) rotate(-360deg); }
`;

const circleAnimation8 = keyframes`
  0% { transform: rotate(0deg) translateX(-380px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(-380px) rotate(-360deg); }
`;

  return (
    <Box position="absolute" top="20%" left="50%" transform="translateX(-50%)">
        <Box
          position="relative"
          width="400px"
          height="400px"
          _before={{
            ...commonStyles,
            content: '""',
            inset: '60px',
            opacity: 0.5,
            animation: `${glowAnimation} 4s ease-in-out infinite`,
          }}
          _after={{
            ...commonStyles,
            content: '""',
            inset: '-20px',
            opacity: 0.4,
            animation: `${glowAnimation} 4s ease-in-out infinite 0.5s`,
          }}
        >
            <Box 
                position="absolute"
                top="46%"
                left="46%"
                transform="translate(100%, 100%)"
                animation={`${circleAnimation2} 8s linear infinite`}
                opacity={0.5}
            >
                <FaBitcoin size={35} />
            </Box>
          <Box
            {...commonStyles}
            top="-100px"
            right="-100px"
            bottom="-100px"
            left="-100px"
            opacity={0.3}
            animation={`${glowAnimation} 4s ease-in-out infinite 1s`}
          />
          <Box 
            position="absolute" 
            top="46%" 
            left="46%" 
            animation={`${circleAnimation1} 8s linear infinite`} 
            opacity={0.5}
          >
            <FaEthereum size={35} />
          </Box>

          <Box
            {...commonStyles}
            inset="-180px"
            opacity={0.2}
            animation={`${glowAnimation} 4s ease-in-out infinite 1.5s`}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation3} 7s linear infinite`}
            opacity={0.4}
          >
            <FaDollarSign size={35} />
          </Box>
          <Box
            {...commonStyles}
            inset="-260px"
            opacity={0.1}
            animation={`${glowAnimation} 4s ease-in-out infinite 2s`}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation4} 7s linear infinite`}
            opacity={0.4}
          >
            <FaEuroSign size={35} />
          </Box> 
          <Box
            {...commonStyles}
            inset="-330px"
            opacity={0.05}
            animation={`${glowAnimation} 4s ease-in-out infinite 2.5s`}
          />
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation5} 6s linear infinite`}
            opacity={0.3}
          >
            <SiBinance size={35} />
          </Box>
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation6} 6s linear infinite`}
            opacity={0.3}
          >
            <FaChartLine size={35} />
          </Box> 
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation7} 5s linear infinite`}
            opacity={0.2}
          >
            <SiSolana size={35} />
          </Box>
          <Box 
            position="absolute"
            top="46%"
            left="46%"
            animation={`${circleAnimation8} 5s linear infinite`}
            opacity={0.2}
          >
            <FaGem size={35} /> 
          </Box>
        </Box>
      </Box>
  )
}

export default Background
