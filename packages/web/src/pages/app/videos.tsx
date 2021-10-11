import { Heading, Table, Thead, Tr, Th, Tbody } from '@chakra-ui/react';
import { NextPage } from 'next';
import React from 'react';
import { AppLayout } from '../../components/Layout';
import { VideoTableRow } from '../../components/Layout/Videos';

export interface Video {
  id: string;
  title: string;
  durationInSeconds: number;
  url: string;
}

const Videos: NextPage = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    const fetchVideos = async () => {
      // Get all videos
      const res = await fetch('/api/videos');
      const videosList = await res.json();

      // Set page status
      setVideos(videosList);
    };

    fetchVideos();
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
        <Tbody>
          {videos
            ? /* Check if videoList has videos */
              videos.length <= 0
              ? /* No: display message */
                'No Videos Found'
              : /* Yes: Create Row for each Video */
                // eslint-disable-next-line react/jsx-key
                videos.map((video) => <VideoTableRow key={video.id} video={video} />)
            : ''}
        </Tbody>
      </Table>
    </AppLayout>
  );
};

export default Videos;
