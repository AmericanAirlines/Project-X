import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Heading,
  HStack,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { FaDiscord } from 'react-icons/fa';
import { AppLayout } from '../../components/Layout';

const Community: NextPage = () => {
  return (
    <AppLayout>
      <Heading>Community</Heading>
      <Accordion defaultIndex={[0]} allowMultiple allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Community Guidelines
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <Text>1. Be respectful.</Text>
            <Text>2. Be professional.</Text>
            <Text>3. Do not let others use your account.</Text>
            <Text>4. Ask questions!</Text>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Joining the Discord Server
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <Text pb={4}>
              Anyone can join the Project-X Discord server, but only user with linked Discord
              accounts will be able to actively participate.
            </Text>
            <Text pb={4}>
              You can do this by naviagting to your profile and clicking the &quot;Link
              Discord&quot; button or by clicking{' '}
              <Link href="/api/auth/discord/login" textColor="blue">
                here
              </Link>
              .
            </Text>
            <Text pb={4}>Remeber to follow the Community Guidlines listed above.</Text>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              FAQ
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Heading as="h3" size="sm">
              What if I need to change my linked Discord account?
            </Heading>
            <Text pb={4}>This is not currently possible, but may be soon!</Text>

            <Heading as="h3" size="sm">
              Should I change my Discord profile avatar?
            </Heading>
            <Text>
              If your profile avatar is something offensive then you should change it immediately.
              If you are unsure then you should probably change it.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <HStack>
        <Spacer />
        <Button bg="#7289da" textColor="#ffffff" leftIcon={<FaDiscord color="#ffffff" />}>
          <Link href="https://discord.gg/pMhrYKbVGS">Join our Discord</Link>
        </Button>
        <Spacer />
      </HStack>
    </AppLayout>
  );
};

export default Community;
