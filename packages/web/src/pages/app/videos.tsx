import { Heading, Table, Thead, Tr, Th } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { Video } from '../../../../api/src/entities/Video';
import { AppLayout } from '../../components/Layout';
import { VideoTableRow } from '../../components/VideoTableRow';

const Videos: NextPage = () => {
  const [status, setStatus] = React.useState<Video[]>();

  React.useEffect(() => {
    const fetchStatus = async () => {

      // Get all videos
      const res = await fetch('/api/videos');
      const videosList = await res.json();

      // Set page status
      setStatus(videosList);
    }

    fetchStatus();
  }, []);

  return (
    <AppLayout>
      <Heading>Videos</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>       
        {status ? 

          /* Check if videoList has videos */
          ((status.length <= 0) ?

            /* No: display message */
            "No Videos Found" : 
            
            /* Yes: Create Row for each Video */
            status?.map( video => { return ( VideoTableRow(video))})) : 
          ""}       
      </Table>
    </AppLayout>
  );
};

export default Videos;