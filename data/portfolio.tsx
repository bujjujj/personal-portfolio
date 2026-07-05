// data/portfolio.ts
export const personalInfo = {
  name: "Chris Zhang",
  role: "",
  bio: [
    "ML/AI engineer and full-stack developer with a focus on audio processing.", 
    "I'm passionate about the intersection between AI and Music, and I love building things that turn signals into meaningful data, like real-time audio feature extractors."
  ],
  email: "chris.jien.zhang@gmail.com",
  github: "https://github.com/bujjujj",
  linkedin: "https://www.linkedin.com/in/cjienz/",
  university: "University of Maryland, College Park",
  major: "Computer Science",
  headshot: "/images/headshot.jpg"
}

export const experiences = [
  {
    id: 1,
    role: "TDP AI Intern",          
    company: "GEICO",     
    duration: "June 2026 – Aug. 2026",
    description: [
        "",
        "",
        "",
    ],
  },
  {
    id: 2,
    role: "Mechanical Team SWE Intern",
    company: "ANSYS",
    duration: "May 2025 – Aug. 2025",
    description: [
        "Operated within an Agile development team with daily scrums, leading a large-scale renovation of the core theming system across 50+ files (C++, C#, JS, HTML), designing and implementing a new API with COM interfaces for cross-language communication, and consolidating redundant color definitions into a single source of truth.",
        "Refactored the report generation system by consolidating 60 language-specific files into a unified, modular framework, achieving an 82% reduction in code duplication—also resolving a critical Linux bug and presenting the streamlined system to the Director of R&D.",
        "Implemented tabular data extraction for Solution objects in shell and scripting modes, collaborating with a Graphics intern to extend support to additional objects.",
    ],
  },
  {
    id: 3,
    role: "Research Assistant",
    company: "University of Maryland – FIRE",
    duration: "Aug. 2023 – Dec. 2024",
    description: [
        "Quantified demographic bias in AI skin cancer detection models by processing a 10,000+ image clinical dataset in R, revealing the dataset was heavily skewed and unrepresentative of actual patient demographics—highlighting a critical source of potential model bias.",
        "Co-authored a formal research paper on the findings and was selected to present this work at the FIRE Summit.",
    ],
  },
]

export const projects = [
  {
    id: 1,
    title: "Personal Playlist Divider",
    description: [
        "Automates music library organization into 11 personalized categories using a custom sonic fingerprint pipeline and a trained Random Forest classifier.",
        "",
        "",
    ],
    skills: ["spotipy", "pandas", "librosa", "scikit-learn", "PyTorch", "Flask", "Socket.io"],
    link: "#",
    thumbnail: "/images/thumbnails/playlist-divider.png",
  },
  {
    id: 2,
    title: "Mini Shazam",
    description: [
        "A full-stack audio fingerprinting app that identifies songs in milliseconds using spectral constellation maps and combinatorial hashing.",
        "",
        "",
    ],
    skills: ["React", "FastAPI", "librosa", "NumPy", "SQLite", "yt_dlp"],
    link: "#",
    thumbnail: "/images/thumbnails/mini-shazam.png",  // Place at public/images/thumbnails/mini-shazam.png
  },
  {
    id: 3,
    title: "Spectrogram Analyzer",
    description: [
        "Deep learning pipeline converting raw audio into Mel-spectrograms for multi-label genre/mood classification, with a Flask app for real-time inference.",
        "",
        "",
    ],
    skills: ["TensorFlow", "Keras", "librosa", "Flask", "pandas"],
    link: "#",
    thumbnail: "/images/thumbnails/spectrogram.png",
  },
]

export const skills = [
  "Python", "C++", "Java", "JavaScript", "Kotlin", "HTML5", "CSS3",
  "React.js", "Three.js", "Node.js", "Flask", "FastAPI",
  "TensorFlow", "Keras", "PyTorch", "scikit-learn", "librosa",
  "Git", "Azure DevOps", "Figma",
]