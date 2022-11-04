import { initializeApp } from "firebase/app";
import {
  ref,
  getStorage,
  uploadBytes,
  FirebaseStorage,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

type FileUpload = {
  path: string;
  mimetype: string;
  filename: string;
};

export class StorageFilesProvider {
  private readonly storage: FirebaseStorage;
  private readonly destination = "images";

  constructor() {
    const instance = initializeApp({
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MSG_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

    this.storage = getStorage(instance);
  }

  async save(file: File): Promise<string> {
    const fileToken = uuid();

    const fileName = `${fileToken}.jpg`;

    const metadata = {
      contentType: "image/jpeg",
      metadata: {
        firebaseStorageDownloadTokens: fileToken,
      },
    };

    await uploadBytes(
      ref(this.storage, `${this.destination}/${fileName}`),
      file,
      metadata
    );

    return fileToken;
  }
}
