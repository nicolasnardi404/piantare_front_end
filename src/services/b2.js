import axios from "axios";
import api from "./api";

class B2Service {
  constructor() {
    this.applicationKeyId = process.env.REACT_APP_B2_APPLICATION_KEY_ID;
    this.applicationKey = process.env.REACT_APP_B2_APPLICATION_KEY;
    this.bucketId = process.env.REACT_APP_B2_BUCKET_ID;
    this.bucketName = process.env.REACT_APP_B2_BUCKET_NAME;
    this.authToken = null;
    this.apiUrl = null;
    this.downloadUrl = null;
  }

  async authorize() {
    if (this.authToken) return;

    const authString = `${this.applicationKeyId}:${this.applicationKey}`;
    const encodedAuth = btoa(authString);

    try {
      const response = await axios.get(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
          headers: {
            Authorization: `Basic ${encodedAuth}`,
          },
        }
      );

      this.authToken = response.data.authorizationToken;
      this.apiUrl = response.data.apiUrl;
      this.downloadUrl = response.data.downloadUrl;
    } catch (error) {
      console.error("B2 authorization failed:", error);
      throw new Error("Failed to authorize with B2");
    }
  }

  async getUploadUrl() {
    await this.authorize();

    try {
      const response = await axios.post(
        `${this.apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: this.bucketId },
        {
          headers: {
            Authorization: this.authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get upload URL:", error);
      throw new Error("Failed to get upload URL");
    }
  }

  async uploadFile(file, fileName) {
    const uploadData = await this.getUploadUrl();
    const uploadUrl = uploadData.uploadUrl;
    const uploadAuthToken = uploadData.authorizationToken;

    try {
      const response = await axios.post(uploadUrl, file, {
        headers: {
          Authorization: uploadAuthToken,
          "Content-Type": file.type,
          "X-Bz-File-Name": encodeURIComponent(fileName),
          "X-Bz-Content-Sha1": "do_not_verify", // In production, you should calculate the SHA1
        },
      });

      // Return the file URL
      return `${this.downloadUrl}/file/${this.bucketName}/${response.data.fileName}`;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("Failed to upload file");
    }
  }

  // Helper to generate a unique file name
  generateFileName(file) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop();
    return `plants/${timestamp}-${randomString}.${extension}`;
  }

  // Main upload method to be used by components
  async uploadImage(file) {
    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload through our backend proxy
      const response = await api.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("Failed to upload file");
    }
  }
}

export const b2Service = new B2Service();
