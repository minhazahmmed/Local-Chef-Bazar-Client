const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData, signal: controller.signal }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.secure_url;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Image upload took too long. Please try again.", {
        cause: error,
      });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export default uploadImage;