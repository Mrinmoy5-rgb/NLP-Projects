# 🧠 NLP Pipeline Visualizer

An interactive web-based **Natural Language Processing (NLP) Pipeline Visualizer** that demonstrates how raw text is transformed into machine-readable data through each stage of the NLP workflow. The project is built using **HTML, CSS, and Vanilla JavaScript** with a modern, responsive user interface. 

---

## 📌 Overview

Natural Language Processing (NLP) is a branch of Artificial Intelligence that enables computers to understand and process human language.

This project visually demonstrates each major step of a typical NLP pipeline, allowing users to enter any sentence and observe how the text changes throughout the processing stages.

---

## ✨ Features

- 🎨 Modern AI-inspired dark UI
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 📝 Interactive text processing
- 🧹 Text Cleaning
- ✂️ Tokenization
- 🌱 Stemming
- 📖 Lemmatization
- 🚫 Stop Word Removal
- 📊 Multiple Vectorization Techniques
  - Bag of Words (BoW)
  - TF-IDF
  - Word Embedding (Simulation)
- 🤖 Rule-based Sentiment Prediction
- 📈 Animated Confidence Meter
- 💡 Prediction Reasoning
- 🎯 Interactive Pipeline Visualization

---

# 🚀 NLP Pipeline

The application follows the complete NLP workflow:

```
Raw Text
    │
    ▼
Text Cleaning
    │
    ▼
Tokenization
    │
    ▼
Stemming
    │
    ▼
Lemmatization
    │
    ▼
Stop Word Removal
    │
    ▼
Vectorization
    │
    ▼
Sentiment Prediction
```

---

# 📖 Processing Steps

## 1️⃣ Text Cleaning

The input sentence is standardized by:

- Converting text to lowercase
- Removing punctuation
- Removing emojis
- Removing URLs
- Removing HTML tags
- Removing numbers
- Removing extra spaces

---

## 2️⃣ Tokenization

The cleaned sentence is split into individual words called **tokens**.

Example:

```
Input:
I love playing cricket

Tokens:
["i", "love", "playing", "cricket"]
```

---

## 3️⃣ Stemming

Stemming removes prefixes or suffixes to produce the root form of a word.

Example:

| Original | Stem |
|----------|------|
| Playing | Play |
| Walking | Walk |
| Running | Run |

---

## 4️⃣ Lemmatization

Lemmatization converts words into their dictionary (base) form using predefined rules.

Example:

| Original | Lemma |
|----------|-------|
| Playing | Play |
| Went | Go |
| Better | Good |

---

## 5️⃣ Stop Word Removal

Common words that provide little semantic meaning are removed.

Example:

```
Original

I love playing cricket in the park

↓

After Stop Word Removal

love
playing
cricket
park
```

---

## 6️⃣ Vectorization

The processed words are converted into numerical representations.

### Bag of Words

Counts the frequency of every word.

### TF-IDF

Calculates the importance of each word based on frequency and rarity.

### Word Embedding (Simulation)

Demonstrates how words can be represented as dense numerical vectors.

---

## 7️⃣ Sentiment Prediction

A simple rule-based model predicts the sentiment of the text as:

- 😊 Positive
- 😐 Neutral
- 😞 Negative

The prediction includes:

- Confidence Score
- Positive Word Count
- Negative Word Count
- Keywords Used
- Prediction Explanation

---

# 🛠️ Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Google Fonts
- Font Awesome

---

# 📂 Project Structure

```
NLP-Pipeline-Visualizer/

│── index.html
│── style.css
│── script.js
│── README.md
```

---

# 🎯 Learning Objectives

This project helps users understand:

- NLP preprocessing
- Tokenization
- Stemming
- Lemmatization
- Stop Word Removal
- Feature Extraction
- Vectorization
- Basic Sentiment Analysis
- Interactive Web Development

---

# ⚙️ How to Run

1. Download or clone the repository.

```
git clone https://github.com/yourusername/NLP-Pipeline-Visualizer.git
```

2. Open the project folder.

3. Open `index.html` in any modern web browser.

No installation or additional dependencies are required.

---

# 📸 Screenshots

Add screenshots of:

- Home Page
- Pipeline Flow
- Tokenization
- Stemming & Lemmatization
- Vectorization
- Sentiment Prediction

---

# 🔮 Future Improvements

- Real NLP library integration (spaCy / NLTK)
- BERT or Word2Vec embeddings
- Named Entity Recognition (NER)
- Part-of-Speech (POS) Tagging
- Text Summarization
- Machine Learning-based Sentiment Analysis
- Export Results as PDF
- Upload Text Files
- Multi-language Support
- Interactive Token Information Popup

---

# 👨‍💻 Author

**Mrinmoy Debnath**

B.Tech CSE Student

Interested in Machine Learning, Data Science, Artificial Intelligence, and Full Stack Development.

---

# 📄 License

This project is developed for educational and learning purposes.

Feel free to modify and improve it for your own learning.