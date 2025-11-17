import { Client, Databases, Query, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MOVIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT_ID = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client().setEndpoint(ENDPOINT_ID).setProject(PROJECT_ID);

const database = new Databases(client);
export const updateSearch = async (search, movie) => {
  try {
    const result = await database.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: MOVIES_COLLECTION_ID,
      queries: [Query.equal("search", search)],
    });

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await database.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: MOVIES_COLLECTION_ID,
        documentId: doc.$id,
        data: {
          count: doc.count + 1,
        },
      });
    } else {
      await database.createDocument({
        databaseId: DATABASE_ID,
        collectionId: MOVIES_COLLECTION_ID,
        documentId: ID.unique(),
        data: {
          search,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchMovies = async () => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      MOVIES_COLLECTION_ID,
      [Query.limit(10), Query.orderDesc("count")]
    );

    return result.documents;
  } catch (error) {
    console.log(error);
  }
};
