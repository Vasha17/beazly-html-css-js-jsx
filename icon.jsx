import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const BeazlyHeader = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    // Add scroll effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        headerRef.current.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        headerRef.current.style.backdropFilter = 'blur(12px)';
      } else {
        headerRef.current.style.boxShadow = 'none';
        headerRef.current.style.backdropFilter = 'blur(8px)';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer ref={headerRef}>
      <HeaderContent>
        <LogoGroup>
          <BeazlyLogo>
            <Book>
              <Pages>
                <Page className="page-1" />
                <Page className="page-2" />
              </Pages>
              <Letter>B</Letter>
            </Book>
            <Ribbon />
          </BeazlyLogo>
          <AppTitle>Beazly</AppTitle>
        </LogoGroup>
        
        <NavButton>
          <MaterialIcon>group_add</MaterialIcon>
          <Tooltip>Mode Kolaborasi</Tooltip>
        </NavButton>
      </HeaderContent>
      
      <AnimatedGradient />
    </HeaderContainer>
  );
};

// Animations
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// Styled Components
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(63, 81, 181, 0.85);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  overflow: hidden;
`;

const AnimatedGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, 
    #4A90E2, 
    #50E3C2, 
    #F5A623, 
    #4A90E2);
  background-size: 300% 300%;
  animation: ${gradientFlow} 8s ease infinite;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BeazlyLogo = styled.div`
  --primary: #4A90E2;
  --secondary: #FFD700;
  width: 40px;
  height: 40px;
  position: relative;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    
    & > div:first-child {
      animation: ${float} 2s ease infinite;
    }
  }
`;

const Book = styled.div`
  background: linear-gradient(145deg, var(--primary), #3A0CA3);
  width: 100%;
  height: 100%;
  border-radius: 8px 10px 10px 6px;
  position: relative;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
  overflow: hidden;
`;

const Pages = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Page = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  left: 15%;
  
  &.page-1 {
    top: 15%;
    width: 70%;
    height: 10px;
    transform: rotate(-2deg);
  }
  
  &.page-2 {
    top: 35%;
    width: 60%;
    height: 8px;
    transform: rotate(3deg);
  }
`;

const Letter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font: bold 20px 'Poppins', sans-serif;
  color: var(--secondary);
`;

const Ribbon = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 15px;
  height: 15px;
  background: var(--secondary);
  clip-path: polygon(100% 0, 100% 100%, 50% 70%, 0 100%, 0 0);
  transform: rotate(15deg);
`;

const AppTitle = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    
    & > span:last-child {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
`;

const MaterialIcon = styled.span`
  font-family: 'Material Icons Sharp';
  font-size: 24px;
`;

const Tooltip = styled.span`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 10px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.7) transparent;
  }
`;

export default BeazlyHeader;