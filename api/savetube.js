import axios from "axios";

async function getRandomCdn() {
  const res = await axios.get("https://ytube.savetube.me/api/random-cdn");
  return res.data.cdn;
}

async function getDownloadKey(cdn, url) {
  try {
    const res = await axios.post(`https://${cdn}/v2/info`, { url }, {
      headers: {
        "Origin": "https://ytube.savetube.me",
        "Referer": "https://ytube.savetube.me",
        "Content-Type": "application/json"
      }
    });
    return res.data?.data || null;
  } catch (err) {
    return null; // return null if this CDN fails
  }
}

async function getDownloadUrl(cdn, key) {
  try {
    const res = await axios.post(`https://${cdn}/download`, {
      downloadType: "audio",
      quality: "128",
      key: key
    }, {
      headers: {
        "Origin": "https://ytube.savetube.me",
        "Referer": "https://ytube.savetube.me",
        "Content-Type": "application/json"
      }
    });
    return res.data?.data?.downloadUrl || null;
  } catch (err) {
    return null; // return null if download fails
  }
}

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

  try {
    // Try up to 5 times to get working CDN
    for (let i = 0; i < 5; i++) {
      const cdn = await getRandomCdn();
      const key = await getDownloadKey(cdn, url);
      if (!key) continue; // try another CDN

      const downloadUrl = await getDownloadUrl(cdn, key);
      if (!downloadUrl) continue; // try another CDN

      return res.status(200).json({ success: true, downloadUrl });
    }

    return res.status(404).json({ success: false, message: "Download URL not found after trying multiple CDNs" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
}
