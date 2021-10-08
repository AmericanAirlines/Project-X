import { Heading, Table, Thead, Tr, Th } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { AppLayout } from '../../components/Layout';
import { VideoTableRow } from '../../components/Layout/Videos/VideoTableRow';

export interface Video {
  title: string,
  durationInSeconds: number,
  url: string
}

const Videos: NextPage = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    const fetchStatus = async () => {

      // Get all videos
      const res = await fetch('/api/videos');
      const videosList = await res.json();

      // Set page status
      setVideos(videosList);
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
        {videos ? 

          /* Check if videoList has videos */
          ((videos.length <= 0) ?

            /* No: display message */
            "No Videos Found" : 
            
            /* Yes: Create Row for each Video */           
            // eslint-disable-next-line react/jsx-key
            videos.map( video => <VideoTableRow video={video} />)) : 
          ""}       
      </Table>
    </AppLayout>
  );
};

export default Videos;
