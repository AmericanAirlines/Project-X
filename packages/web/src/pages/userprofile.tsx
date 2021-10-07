import React from 'react';
import { NextPage } from 'next';
import { Heading } from '@chakra-ui/layout';
import { MarketingLayout } from '../components/Layout';

const UserProfile: NextPage = () => {
    // Make page stateful
    // Fetch user data using users API
    // Display fetched user data in their respective fields

    // Things to think about:
    // What to return if invalid user id is passed into API (or what happens if API fails to retrieve any data)
    // Figure out the layout of the page

    return (
        <MarketingLayout>
            <Heading>Profile Page</Heading>
        </MarketingLayout>
    );
};

export default UserProfile;
