import React from 'react';
import Link from 'next/link';
import { Video } from '../../../api/src/entities/Video';
import { Tr, Td, useTheme} from '@chakra-ui/react';

export const VideoTableRow = (video:Video) => {
  const theme = useTheme();

  // Convert durationInSeconds
  var hours = Math.floor(video.durationInSeconds / 3600);
  var minutes = Math.floor((video.durationInSeconds - (hours * 3600)) / 60);
  var seconds = (video.durationInSeconds % 60);

  // Format time values
  const formattedHours = ('00'+ hours).slice(-2);
  const formattedMinutes = ('00'+ minutes).slice(-2);
  const formattedSeconds = ('00'+ seconds).slice(-2);

  return (
    <Tr>
      <Td>
        <Link href={video.url} passHref>
          {video.title}
        </Link>
      </Td>
      
      <Td>{formattedHours}:{formattedMinutes}:{formattedSeconds}</Td>
    </Tr>
  );
};