import React, { useState } from "react";
import "./GISDashboard.css";

const MosquitoDetection = ({ setShowDetectionPage, setDetectionData }) => {
  const [inputImage, setInputImage] = useState(null);
  const [date, setDate] = useState("");
  const [area, setArea] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectionResults, setDetectionResults] = useState(null);
  const [outputImageUrl, setOutputImageUrl] = useState(null);

  // API Keys and Config
  const OPENWEATHER_API_KEY = "73b4d32680646301ba59ca5994935e23";
  const ROBOFLOW_API_KEY = "2vceW0X9jtAnL7p71ITR";
  const WORKSPACE_NAME = "final-year-project-4tw9o";
  const WORKFLOW_ID = "small-object-detection-sahi";
  const CLOUDINARY_CLOUD_NAME = "ddae0u14c";
  const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "image/png") {
      setInputImage(file);
    } else {
      alert("Please upload a PNG image only.");
      event.target.value = "";
    }
  };

  const fetchWeatherData = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) throw new Error(data.message);

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      precipitation: data.rain?.["1h"] || data.snow?.["1h"] || 0,
      waterIndex: data.main.humidity,
    };
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "sentinel-2-imagery");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");

    return data.secure_url;
  };

  const sendToRoboflow = async (imageUrl) => {
    const response = await fetch(
      `https://serverless.roboflow.com/infer/workflows/${WORKSPACE_NAME}/${WORKFLOW_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: ROBOFLOW_API_KEY,
          inputs: {
            image: {
              type: "url",
              value: imageUrl,
            },
          },
        }),
      }
    );

    const result = await response.json();
    return result;
  };

  const handleSubmit = async () => {
    if (!inputImage || !date || !area) {
      alert("Please provide all required details.");
      return;
    }

    setLoading(true);
    setWeatherInfo(null);
    setDetectionResults(null);
    setOutputImageUrl(null);

    try {
      // Step 1: Get Weather Info
      const weather = await fetchWeatherData(area);
      setWeatherInfo(weather);

      // Step 2: Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(inputImage);

      // Step 3: Call Roboflow with Cloudinary Image URL
      const result = await sendToRoboflow(cloudinaryUrl);
      console.log("✅ Roboflow Response:", result);

      // Step 4: Show Roboflow Output Image
      const base64Image = result?.outputs?.[0]?.output_image?.value;
      if (base64Image) {
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;
        setOutputImageUrl(dataUrl); // Show in <img>
        alert("Image processed successfully by Roboflow!");
      } else {
        console.warn("❌ Roboflow returned no base64 image");
        alert("Detection failed or no output image returned.");
      }

      // Optional: You can parse other outputs too
      setDetectionData(result?.outputs || []);
    } catch (error) {
      console.error("❌ Error during submission:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detection-wrapper">
      <div className="images-side-by-side">
        {inputImage && (
          <div className="image-preview-container">
            <h3>Input Image</h3>
            <img src={URL.createObjectURL(inputImage)} alt="Input Preview" />
          </div>
        )}

        {outputImageUrl && (
          <div className="image-preview-container">
            <h3>Output (Detected) Image</h3>
            <img
              src={outputImageUrl}
              alt="Detected Output"
              crossOrigin="anonymous"
              style={{ maxWidth: "100%", border: "1px solid #ccc" }}
            />
          </div>
        )}
      </div>

      <div className="detection-container">
        <h2>Upload Image for Mosquito Habitat Detection</h2>

        <label htmlFor="image-upload" className="upload-label">
          Upload PNG Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/png"
          onChange={handleImageUpload}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Area Name"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <div className="button-container">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>
          <button
            onClick={() => setShowDetectionPage(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {weatherInfo && (
          <div className="weather-info">
            <h3>
              Weather Data for {area} on {date}
            </h3>
            <p>Temperature: {weatherInfo.temperature} °C</p>
            <p>Humidity: {weatherInfo.humidity} %</p>
            <p>Precipitation: {weatherInfo.precipitation} mm</p>
            <p>Water Index: {weatherInfo.waterIndex} %</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MosquitoDetection;
