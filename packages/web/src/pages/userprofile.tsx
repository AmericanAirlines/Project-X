import React from 'react';
import { NextPage } from 'next';
import { MarketingLayout } from '../components/Layout';
import queryString from 'query-string';
import { UserProfileLayout, UserProfileData } from '../components/Layout/UserProfileLayout';
import { Alert, AlertIcon } from '@chakra-ui/alert';

const UserProfile: NextPage = () => {
    const [user, setUser] = React.useState<UserProfileData>({name: "", hireable: false, purpose: ""});
    const [isValidUser, setIsValidUser] = React.useState<boolean>(false); // Flag used to catch whether id entered is in database

    React.useEffect(() => {
        const fetchStatus = async () => {

            // Assuming that you need a query parameter to see a specific user's profile page (/userprofile?id=#)
            // Concern?: Goes this route when there are additional parameters after id (/userprofile?id=#&key=value)
            if(!isNaN(Number(queryString.parse(location.search).id)))
            {
                const userAPIQuery: string = "/api/users/" + queryString.parse(location.search).id;
                
                // If user id doesn't exist in database, throw the 400 error from users API
                // Concern?: Catch block has nothing since isValidUser is by default set to false
                try
                {
                    const res = await fetch(userAPIQuery);
                    const data = await res.json();

                    setUser(data);

                    setIsValidUser(true);
                }
                catch
                {

                }

            }
             // When login is implemented, should get user id from session and return logged in user's data (if logged in)
             // Concern?: ^ is this the idea?
            else
            {
               // setUser(null);
            }
            
        };

        fetchStatus();
    }, []);

    // When user id not entered as query parameter or could not be found in the database
    // Concern?: The user's name is required value in the database, default user state assigns "" as name. Don't know if this is ok to find bad input
    if(user.name === "")
    {
        return (
            <MarketingLayout>
                <Alert status="error">
                    <AlertIcon/>
                    User could not be found
                </Alert>
            </MarketingLayout>
        );
    }
    else // On valid and found user id
    {
        return (
            <MarketingLayout>
                <UserProfileLayout {...user} />
            </MarketingLayout>
        );
    }
};

export default UserProfile;
