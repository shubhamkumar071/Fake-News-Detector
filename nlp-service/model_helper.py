import re
import math
from textblob import TextBlob
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# Download necessary NLTK packages if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

# Lexicons for analysis
TOXIC_WORDS = {
    'fake', 'liar', 'fraud', 'bullshit', 'stupid', 'idiot', 'moron', 'hate', 'kill', 'destroy',
    'corrupt', 'garbage', 'scum', 'worthless', 'pathetic', 'disgusting', 'filthy', 'shameful',
    'propaganda', 'scam', 'con', 'cheat', 'bastard', 'hell', 'crap', 'asshole', 'bitch', 'damn'
}

EMOTION_LEXICON = {
    'fear': {'terror', 'panic', 'afraid', 'scared', 'dread', 'horror', 'fright', 'threat', 'danger', 'alarm', 'anxiety', 'worried', 'nervous', 'terrified', 'apocalypse', 'crisis', 'doomed', 'warns', 'collapse'},
    'anger': {'furious', 'rage', 'outrage', 'mad', 'angry', 'hostile', 'resent', 'annoyed', 'hate', 'bitter', 'offended', 'disgusted', 'slams', 'attacks', 'blasts', 'demands', 'threatens'},
    'joy': {'happy', 'joy', 'love', 'wonderful', 'excellent', 'amazing', 'great', 'glad', 'proud', 'triumph', 'victory', 'hope', 'peace', 'successful', 'delight', 'blessing', 'celebrate'},
    'sadness': {'sad', 'grief', 'sorrow', 'mourn', 'tragedy', 'unhappy', 'depressed', 'lonely', 'miss', 'cry', 'weep', 'pain', 'hurt', 'loss', 'devastated', 'hopeless', 'gloomy'}
}

CLICKBAIT_PATTERNS = [
    r'^\d+\s+(ways|reasons|things|facts|secrets|places|times|tricks|tips)', # e.g. "10 secrets..."
    r'you\s+won\'t\s+believe',
    r'will\s+blow\s+your\s+mind',
    r'what\s+happened\s+next',
    r'this\s+is\s+why',
    r'shocking\s+truth',
    r'secret\s+formula',
    r'scientists\s+don\'t\s+want\s+you\s+to\s+know',
    r'shocking\s+revelation',
    r'everything\s+you\s+need\s+to\s+know\s+about',
    r'is\s+this\s+the\s+end\s+of',
    r'what\s+they\s+aren\'t\s+telling\s+you',
    r'here\'s\s+how',
    r'see\s+how\s+this'
]

BIAS_WORDS = {
    'clearly', 'obviously', 'undeniably', 'without\s+a\s+doubt', 'everyone\s+knows',
    'extreme', 'radical', 'far-left', 'far-right', 'woke', 'fascist', 'regressive',
    'sensational', 'unbelievable', 'dreadful', 'spectacular', 'outstanding',
    'corrupt', 'crooked', 'fake\s+news', 'mainstream\s+media', 'elites'
}

MANIPULATION_RULES = [
    {
        "type": "Fear-mongering",
        "keywords": ['apocalypse', 'doomed', 'collapse', 'crisis', 'imminent\s+danger', 'threaten', 'terror', 'destruction', 'panic', 'devastating'],
        "explanation": "Uses high-arousal negative emotion words to induce fear rather than presenting objective details."
    },
    {
        "type": "Sensationalism",
        "keywords": ['shocking', 'unbelievable', 'mind-blowing', 'miracle', 'disaster', 'bombshell', 'spectacular', 'historic', 'unprecedented'],
        "explanation": "Uses hyperbolic phrasing to make events seem more dramatic or important than they are."
    },
    {
        "type": "Ad Hominem/Labeling",
        "keywords": ['crooked', 'corrupt', 'fascist', 'idiots', 'morons', 'clowns', 'traitors', 'puppet', 'liars'],
        "explanation": "Attacks character or assigns highly subjective, derogatory labels instead of addressing the core argument."
    },
    {
        "type": "Urgency/Clickbait",
        "keywords": ['must\s+read', 'act\s+now', 'share\s+before\s+deleted', 'you\s+won\'t\s+believe', 'what\s+happened\s+next', 'will\s+blow\s+your\s+mind'],
        "explanation": "Creates artificial urgency or curiosity gaps to force clicks and viral sharing."
    },
    {
        "type": "Absolute Certainty (Bias)",
        "keywords": ['obviously', 'clearly', 'undeniably', 'without\s+a\s+doubt', 'always', 'never', 'proven\s+beyond\s+question'],
        "explanation": "Presents controversial assertions as absolute, unquestionable facts without providing evidence."
    }
]

def extract_keywords(text: str, max_words: int = 8) -> list:
    """Extract key terms using frequency and stopword filtering."""
    if not text:
        return []
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    # Clean and filter non-alphabetic tokens and short words
    filtered = [w for w in words if w.isalpha() and w not in stop_words and len(w) > 3]
    freq = {}
    for w in filtered:
        freq[w] = freq.get(w, 0) + 1
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w[0] for w in sorted_words[:max_words]]

def analyze_clickbait(text: str) -> dict:
    """Analyze clickbait score based on patterns, exclamation marks, and syntax structure."""
    if not text:
        return {"score": 0, "matched": []}
    
    score = 0
    matched = []
    
    # 1. Match regex patterns
    text_lower = text.lower()
    for pattern in CLICKBAIT_PATTERNS:
        if re.search(pattern, text_lower):
            score += 35
            matched.append(f"Curiosity gap pattern: '{pattern}'")
            
    # 2. Exclamation marks count
    excl_count = text.count('!')
    if excl_count > 0:
        score += min(excl_count * 15, 30)
        matched.append("Contains exclamation marks")
        
    # 3. Question structure (often clickbait when combined with other indicators)
    if text.endswith('?') and len(text.split()) < 15:
        score += 20
        matched.append("Question headline")
        
    # 4. All Caps words count
    words = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 1 and w.isalpha()]
    if caps_words:
        score += min(len(caps_words) * 10, 25)
        matched.append(f"All-caps words: {', '.join(caps_words[:3])}")
        
    # Cap score at 100
    final_score = min(score, 100)
    return {"score": final_score, "matched": matched}

def analyze_toxicity(text: str) -> float:
    """Detect presence of abusive, toxic, or aggressive language."""
    if not text:
        return 0.0
    words = word_tokenize(text.lower())
    if not words:
        return 0.0
    toxic_count = sum(1 for w in words if w in TOXIC_WORDS)
    score = (toxic_count / len(words)) * 1000  # scale it up
    # Add sentiment factor (very negative sentiment increases toxicity weight)
    blob = TextBlob(text)
    if blob.sentiment.polarity < -0.4:
        score += abs(blob.sentiment.polarity) * 35
        
    return min(round(score, 1), 100.0)

def analyze_emotions(text: str) -> dict:
    """Breakdown text into primary emotions: fear, anger, joy, sadness."""
    if not text:
        return {"fear": 0, "anger": 0, "joy": 0, "sadness": 0, "overallScore": 0}
    
    words = word_tokenize(text.lower())
    total_words = len(words) if words else 1
    
    counts = {"fear": 0, "anger": 0, "joy": 0, "sadness": 0}
    for w in words:
        for emo, term_set in EMOTION_LEXICON.items():
            if w in term_set:
                counts[emo] += 1
                
    # Normalize and convert to score out of 100
    scores = {}
    for emo, cnt in counts.items():
        # log scale to represent emotional intensity better
        score = (cnt / math.sqrt(total_words)) * 120
        scores[emo] = min(round(score * 10), 100)
        
    # Overall score represents how emotional/subjective the text is
    overall = max(scores.values()) if scores.values() else 0
    scores["overallScore"] = int(overall)
    return scores

def detect_bias(text: str) -> dict:
    """Analyze subjectivity and linguistic bias markers."""
    if not text:
        return {"score": 0, "level": "Low"}
    
    blob = TextBlob(text)
    subj = blob.sentiment.subjectivity * 100  # 0 to 100
    
    # Analyze polarizing terms
    text_lower = text.lower()
    bias_word_count = 0
    for pattern in BIAS_WORDS:
        matches = re.findall(pattern, text_lower)
        bias_word_count += len(matches)
        
    word_count = len(text.split()) if text.split() else 1
    bias_density = (bias_word_count / word_count) * 1500
    
    # Combined score
    score = int((subj * 0.6) + (min(bias_density, 100) * 0.4))
    
    level = "Low"
    if score > 60:
        level = "High"
    elif score > 30:
        level = "Medium"
        
    return {"score": score, "level": level}

def detect_ai_generation(text: str) -> int:
    """Simulate AI generation probability by evaluating perplexity proxies:
    - Sentence length variance (human text varies highly, AI is often uniform)
    - Lexical diversity (ratio of unique words)
    - Average word length
    """
    if not text or len(text.split()) < 15:
        return 10  # default low probability for short text
        
    sentences = sent_tokenize(text)
    words = word_tokenize(text.lower())
    
    # 1. Burstiness (Sentence length variance)
    lens = [len(s.split()) for s in sentences if s.strip()]
    if len(lens) > 1:
        mean_len = sum(lens) / len(lens)
        variance = sum((x - mean_len) ** 2 for x in lens) / len(lens)
        sd = math.sqrt(variance)
        # Low standard deviation indicates uniform (AI-like) structure
        sd_score = max(0, 50 - (sd * 3.5))
    else:
        sd_score = 25
        
    # 2. Lexical Diversity
    unique_ratio = len(set(words)) / len(words) if words else 0.5
    # AI generated text tends to repeat common words, lower lexical diversity
    div_score = max(0, (0.7 - unique_ratio) * 100)
    
    # 3. Text Blob Subjectivity (AI text is often neutral / lower subjectivity)
    blob = TextBlob(text)
    subj = blob.sentiment.subjectivity
    subj_score = max(0, (0.3 - subj) * 80)
    
    prob = int(sd_score + div_score + subj_score)
    # Add minor random variance to simulate dynamic neural perplexity
    prob = min(max(prob, 5), 95)
    return prob

def find_manipulative_phrases(text: str) -> list:
    """Search for manipulation patterns and return character offsets (indices) for visual highlights."""
    if not text:
        return []
        
    phrases = []
    
    # Scan text for matching manipulative keywords/rules
    for rule in MANIPULATION_RULES:
        for keyword in rule["keywords"]:
            # Find word boundaries
            pattern = r'\b(' + keyword + r'\w*)\b'
            for match in re.finditer(pattern, text, re.IGNORECASE):
                phrases.append({
                    "phrase": match.group(0),
                    "type": rule["type"],
                    "explanation": rule["explanation"],
                    "startIndex": match.start(),
                    "endIndex": match.end()
                })
                
    # De-duplicate overlapping indices (favor longer matches)
    phrases = sorted(phrases, key=lambda x: (x["startIndex"], -(x["endIndex"] - x["startIndex"])))
    filtered_phrases = []
    last_end = -1
    for p in phrases:
        if p["startIndex"] >= last_end:
            filtered_phrases.append(p)
            last_end = p["endIndex"]
            
    return filtered_phrases

def calculate_credibility_score(fake_prob: int, bias_score: int, emo_score: int, toxicity: float, clickbait: int) -> int:
    """Calculate final 0-100 credibility score where 100 means fully reliable."""
    # Weights for calculation
    # Fake probability is the strongest negative factor (40%)
    # Bias is 20%
    # Clickbait is 15%
    # Emotion is 15%
    # Toxicity is 10%
    
    penalty = (fake_prob * 0.40) + (bias_score * 0.20) + (clickbait * 0.15) + (emo_score * 0.15) + (toxicity * 0.10)
    
    score = 100 - penalty
    # Round and restrict within 3 to 98 (to avoid absolute 100 or 0 which is rare in real evaluations)
    return min(max(int(round(score)), 3), 98)

def analyze_text(text: str) -> dict:
    """Full pipeline to analyze text and return structured response."""
    if not text or not text.strip():
        return {
            "credibilityScore": 50,
            "fakeProbability": 50,
            "biasLevel": "Medium",
            "biasScore": 50,
            "emotionScore": 0,
            "toxicityScore": 0,
            "sentiment": "Neutral",
            "keywords": [],
            "summary": "No text provided.",
            "manipulativePhrases": [],
            "clickbaitScore": 0,
            "aiGeneratedProbability": 0,
            "emotions": {"fear": 0, "anger": 0, "joy": 0, "sadness": 0}
        }
        
    blob = TextBlob(text)
    
    # Sentiment Label
    polarity = blob.sentiment.polarity
    if polarity > 0.15:
        sentiment = "Positive"
    elif polarity < -0.15:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    # Analyze components
    clickbait_data = analyze_clickbait(text)
    clickbait_score = clickbait_data["score"]
    toxicity_score = analyze_toxicity(text)
    emotions_data = analyze_emotions(text)
    bias_data = detect_bias(text)
    ai_prob = detect_ai_generation(text)
    
    # Classify fake news probability based on components
    # Heuristics: high bias, high toxicity, high clickbait, and negative sentiments raise fake probability
    sentiment_factor = 25 if sentiment == "Negative" else 0
    base_fake = (bias_data["score"] * 0.3) + (clickbait_score * 0.25) + (toxicity_score * 0.25) + sentiment_factor
    # Bound and refine
    fake_prob = min(max(int(base_fake), 5), 95)
    
    # Calculate overall credibility score
    credibility = calculate_credibility_score(
        fake_prob=fake_prob,
        bias_score=bias_data["score"],
        emo_score=emotions_data["overallScore"],
        toxicity=toxicity_score,
        clickbait=clickbait_score
    )
    
    # Generate simple summary
    sentences = sent_tokenize(text)
    summary = sentences[0] if sentences else ""
    if len(sentences) > 1:
        # Pick first and last sentence or first two as a preview summary
        summary += " " + sentences[1]
    if len(summary) > 200:
        summary = summary[:197] + "..."
        
    # Spans of manipulative phrases
    phrases = find_manipulative_phrases(text)
    
    # Extract keywords
    keywords = extract_keywords(text)
    
    return {
        "credibilityScore": credibility,
        "fakeProbability": fake_prob,
        "biasLevel": bias_data["level"],
        "biasScore": bias_data["score"],
        "emotionScore": emotions_data["overallScore"],
        "toxicityScore": int(toxicity_score),
        "sentiment": sentiment,
        "keywords": keywords,
        "summary": summary,
        "manipulativePhrases": phrases,
        "clickbaitScore": clickbait_score,
        "aiGeneratedProbability": ai_prob,
        "emotions": {
            "fear": emotions_data["fear"],
            "anger": emotions_data["anger"],
            "joy": emotions_data["joy"],
            "sadness": emotions_data["sadness"]
        }
    }
