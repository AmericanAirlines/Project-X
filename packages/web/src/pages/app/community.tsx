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
  ListItem,
  OrderedList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import { NextPage } from 'next';
import React from 'react';
import { DiscordButtonCheck } from '../../components/DiscordCheck';
import { AppLayout } from '../../components/Layout';
import { UserProfile } from '../../components/userprofile';

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
            <OrderedList>
              <ListItem>Be respectful.</ListItem>
              <ListItem>Be professional.</ListItem>
              <ListItem>Do not let others use your account.</ListItem>
              <ListItem>Ask questions!</ListItem>
            </OrderedList>
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
              Anyone can join the Project-X Discord server, but only users with linked Discord
              accounts will be able to actively participate.
            </Text>
            <Text pb={4}>
              You can do this by navigating to your profile and clicking the &quot;Link
              Discord&quot; button or by clicking{' '}
              <Link href="/api/auth/discord/login" textColor="blue">
                here
              </Link>
              .
            </Text>
            <Text pb={4}>Remember to follow the Community Guidelines listed above.</Text>
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
              Your profile avatar should be professional. As a general rule of thumb, it should be
              something you would feel comfortable showing your friends and family.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <DiscordButtonCheck user={Request.arguments}>
      </DiscordButtonCheck>
    </AppLayout>
  );
};

export default Community;
