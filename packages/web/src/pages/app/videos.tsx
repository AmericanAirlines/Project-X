import { Heading, Table, Thead, Tr, Th, Tbody, Text, Input, Button, HStack } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { ChangeEventHandler } from 'react';
import { AppLayout } from '../../components/Layout';
import { VideoTableRow } from '../../components/Videos';

export interface Video {
  id: string;
  title: string;
  durationInSeconds: number;
  url: string;
}

const Videos: NextPage = () => {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const currentSearchQuery = React.useRef(searchQuery);
  currentSearchQuery.current = searchQuery;

  React.useEffect(() => {
    const fetchVideos = async () => {
      // Get videos 
      const res = await fetch(`/api/videos?q=${searchQuery}`);
      const videosList = await res.json();

      // Set page status
      if(currentSearchQuery.current===searchQuery){
        setVideos(videosList);        
      }
    };

    fetchVideos();
  }, [searchQuery]);
  
  return (
    <AppLayout>
      <HStack>
        <Heading flex={1} >Videos</Heading>
        <Input id="searchQuery" placeholder="Search videos" width='300px' value={searchQuery} type="text" autoComplete="off" onChange={(event) => setSearchQuery(event.target.value)} />
      </HStack>
      {videos.length <= 0 ? (
        <Text>No Videos Found</Text>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Duration</Th>
            </Tr>
          </Thead>
          <Tbody>
            {videos.map((video) => (
              <VideoTableRow key={video.id} video={video} />
            ))}
          </Tbody>
        </Table>
      )}
    </AppLayout>
  );
};

export default Videos;
