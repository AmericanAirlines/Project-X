import React from 'react';
import { UserProfileLayout, UserProfileData } from '../../../src/components/UserProfile/UserProfileLayout';
import { render, screen } from '../../testUtils/testTools';

const sampleUser: UserProfileData = {
    name: "Steve Job",
    hireable: true,
    purpose: "need 2 jobs",
    pronouns: "he/him",
    schoolName: "Apple University"
}

describe("Mock UserProfileLayout component", () => {
    it('renders sampleUser', () => {
        render(<UserProfileLayout {...sampleUser}/>)

        expect(screen.getByText('Steve Job')).toBeVisible();
        expect(screen.getByText('he/him')).toBeVisible();
        expect(screen.getByText('Apple University')).toBeVisible();
    });
});