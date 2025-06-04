export const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
      },
      // Explicitly disable CORS mode to allow downloads from other domains
      mode: "no-cors",
    });

    // Create a proxy URL for the file
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const proxyResponse = await fetch(proxyUrl);

    if (!proxyResponse.ok) {
      throw new Error(`HTTP error! status: ${proxyResponse.status}`);
    }

    const blob = await proxyResponse.blob();
    if (blob.size === 0) {
      throw new Error("File is empty");
    }

    // Create download link
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    return true;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};
