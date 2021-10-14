import React from 'react';
import { NextPage } from 'next';
import { MarketingLayout } from '../../components/Layout';
import { useRouter } from 'next/router';
import { UserProfileLayout, UserProfileData } from '../../components/userprofile/UserProfileLayout';
import { Alert, AlertIcon } from '@chakra-ui/alert';

const UserProfile: NextPage = () => {
    const [user, setUser] = React.useState<UserProfileData>();
    const [errorMessage, setErrorMessage] = React.useState<string>();

    const router = useRouter();
    const { uid } = router.query;

    React.useEffect(() => {
        const fetchStatus = async () => {


            // Assuming that you need a query parameter to see a specific user's profile page (/userprofile?id=#)
            if(!isNaN(Number(uid)))
            {
                const userAPIQuery: string = "/api/users/" + uid;
                
                // If user id doesn't exist in database, throw the 400 error from users API
                // Concern?: Catch block has nothing since isValidUser is by default set to false
                try
                {
                    const res = await fetch(userAPIQuery);
                    const data = await res.json();

                    setUser(data);
                }
                catch
                {
                    setErrorMessage("User could not be found");
                }

            }
             // If no id parameter provided, when login is implemented, should use user id from session (if logged in)
            else
            {
                // If no id query parameter passed
                if(uid == null)
                {
                    setErrorMessage("Login not setup yet");
                }
                else // If id parameter is a string
                {
                    setErrorMessage("id must be an integer");
                }
            }
            
        };

        fetchStatus();
    }, [uid]);

    // If user is not logged in, don't let user see profile
    if(user === undefined)
    {
        return (
            <MarketingLayout>
                <Alert status="error">
                    <AlertIcon/>
                    {errorMessage}
                </Alert>
            </MarketingLayout>
        );
    }
    else
    {
        return (
            <MarketingLayout>
                <UserProfileLayout {...user} />
            </MarketingLayout>
        );
    }
};

export default UserProfile;
