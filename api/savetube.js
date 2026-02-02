import axios from "axios";

// Hardcoded key from the network requests
const key = "f70db03743f7f7374ba90586aa9463ae3ac70fa3";

export default async function handler(req, res) {
  try {
    // POST to the CDN download endpoint using the hardcoded key
    const response = await axios.post(
      "https://cdn400.savetube.vip/download",
      {
        downloadType: "audio",
        quality: "128",
        key: key, // <-- using hardcoded key here
      },
      {
        headers: {
          "Content-Type": "application/json",
          Origin: "https://ytube.savetube.me",
          Referer: "https://ytube.savetube.me",
        },
      }
    );

    const downloadUrl = response.data?.data?.downloadUrl || null;

    if (!downloadUrl) {
      return res.status(404).json({
        success: false,
        message: "Download URL not found",
      });
    }

    return res.status(200).json({
      success: true,
      downloadUrl,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
