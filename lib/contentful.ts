import { createClient } from 'contentful';

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

console.log('Contentful Space ID:', spaceId);
console.log('Contentful Access Token:', accessToken ? 'Present' : 'Missing');

if (!spaceId || !accessToken) {
  throw new Error("Contentful credentials are missing. Check your .env file.");
}

export const client = createClient({
  space: spaceId,
  accessToken: accessToken,
  environment: 'master',
});

export async function getEntries(contentType: string) {
  try {
    console.log('Fetching entries for content type:', contentType);
    const entries = await client.getEntries({
      content_type: contentType,
      include: 3,
    });
    console.log('Found entries:', entries.items.length);
    return entries.items;
  } catch (error) {
    console.error('Error fetching Contentful entries:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error;
  }
}

export async function getEntry(entryId: string) {
  try {
    console.log('Fetching entry:', entryId);
    const entry = await client.getEntry(entryId, {
      include: 3,
    });
    return entry;
  } catch (error) {
    console.error('Error fetching Contentful entry:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    throw error;
  }
}
