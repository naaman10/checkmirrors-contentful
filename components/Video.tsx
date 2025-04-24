'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';

interface VideoProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function Video({ section }: VideoProps) {
  if (!section?.fields?.youtubeUrl) {
    console.warn('No YouTube URL provided for Video component');
    return null;
  }

  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(section.fields.youtubeUrl as string);
  
  if (!videoId) {
    console.warn('Invalid YouTube URL provided');
    return null;
  }

  return (
    <div className="youtube-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  );
} 