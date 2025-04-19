import { createClient } from 'contentful';

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

console.log('Contentful Space ID:', spaceId);
console.log('Contentful Access Token:', accessToken ? 'Present' : 'Missing');

if (!spaceId || !accessToken) {
  throw new Error("Contentful credentials are missing. Check your .env file.");
}

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

export async function getEntries(contentType: string) {
  try {
    const entries = await client.getEntries({
      content_type: contentType,
      include: 3, // Reduced from 10 to 3 for better performance
    });
    return entries.items;
  } catch (error) {
    console.error('Error fetching Contentful entries:', error);
    throw error;
  }
}

export async function getEntry(entryId: string) {
  try {
    const entry = await client.getEntry(entryId, {
      include: 3,
    });
    return entry;
  } catch (error) {
    console.error('Error fetching Contentful entry:', error);
    throw error;
  }
}
