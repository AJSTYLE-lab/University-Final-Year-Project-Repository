# University Final Year Project: 🦟 Mosquito Surveillance System

An AI-powered system for detecting mosquito habitat **risk zones** using Sentinel-2 imagery, environmental data, and geospatial visualization. Combines object detection (YOLOv12), GIS mapping, and a natural language interface via Large Language Models (LLMs).

---

## 📌 Project Overview

This project identifies **High Risk**, **Intermediate Risk**, and **Low Risk** mosquito breeding zones using satellite imagery and environmental factors like temperature, humidity, and precipitation (rainfall). The system includes:

- Object detection using Sentinel-2 imagery.
- Environmental data integration for model enhancement.
- GIS-based dashboard for spatial insights.
- Natural Language Query support via LLMs.
- Real-time frontend interaction via Roboflow API.

---

## 🚀 Features

- 🛰️ **Satellite Image Annotation:** 80 Sentinel-2 images annotated using Roboflow.
- 🧠 **Model Training:** Trained 4 object detection models; YOLOv12 performed best.
- 📈 **Evaluation Metrics:**  
  - **mAP@50:** 29.8%  
  - **Precision:** 29.2%  
  - **Recall:** 69.0%
- 🔌 **API Integration:** Deployed model via Roboflow and connected to frontend using FastAPI.
- 🌍 **GIS Dashboard:** Interactive map, bar chart, pie chart, line graph, and stacked-bar chart for insights and assist in decision making.
- 🤖 **LLM Integration:** Enables users to query structured data in natural language.
- 🗃️ **Backend:** Relational database designed to manage structured data.

---

## 🛠 Tech Stack & Tools

| Category             | Technologies Used                                           |
|---------------------|-------------------------------------------------------------|
| Programming          | Python, MySQL                                               |
| ML/DL Frameworks     | YOLOv12, TensorFlow, Scikit-learn                            |
| Geospatial Tools     | QGIS, Google Earth Engine                                   |
| Annotation Platform  | Roboflow                                                    |
| API & Backend        | FastAPI, MySQL Workbench, Roboflow API                                     |
| Frontend & Dashboard | React.js, Roboflow API Integration     |
| LLM Integration      | Gemini API (for querying structured data)       |
| Collaboration        | Git, Trello, Microsoft Teams, Slack, Google Classroom                         |

---

## 🧪 Model Workflow

1. Annotate Sentinel-2 images in Roboflow.
2. Train multiple object detection models (YOLO variants).
4. Select best model based on mAP/Precision/Recall.
5. Deploy via Roboflow API.
6. Visualize output on GIS dashboard.
7. Query data using LLM (natural language interface).

---

## 📊 GIS Dashboard Preview

> _Insert screenshots or link to demo here if available._

---

## 🤝 Acknowledgments

- **FAST-NUCES** – Final Year Project Support.
- **Supervisor** - Maam Mamoona Akbar Khan.
- **Omdena** – Inspired methodology from Urban Green Space Mapping.  
- **Roboflow** – Annotation & Deployment.  
- **Gemini AI** – LLM integration support.

---

## 📬 Contact

**📛 Name:** Ahmed Javed

📧 [Email](aj483267@gmail.com) | 🔗 [LinkedIn](https://www.linkedin.com/in/m-ahmed-/) | 🌐 [Portfolio](https://www.datascienceportfol.io/Muhammad_Ahmed)
