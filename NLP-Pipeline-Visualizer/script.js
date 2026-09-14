/*==================================================
    NLP PIPELINE VISUALIZER
    script.js
    PART 1A
==================================================*/

/*=========================
    DOM ELEMENTS
=========================*/

const inputText = document.getElementById("inputText");

const processBtn = document.getElementById("processBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const cleanedOutput = document.getElementById("cleanedOutput");

const tokenOutput = document.getElementById("tokenOutput");

const stemTable = document.getElementById("stemTable");
const lemmaTable = document.getElementById("lemmaTable");

const remainingWords = document.getElementById("remainingWords");
const removedWords = document.getElementById("removedWords");

const vectorContent = document.getElementById("vectorContent");

const predictionResult = document.getElementById("predictionResult");
const confidenceValue = document.getElementById("confidenceValue");
const confidenceFill = document.getElementById("confidenceFill");
const predictionBadge = document.getElementById("predictionBadge");
const predictionEmoji = document.getElementById("predictionEmoji");
const positiveCount = document.getElementById("positiveCount");
const negativeCount = document.getElementById("negativeCount");
const keywordsList = document.getElementById("keywordsList");
const predictionExplanation = document.getElementById("predictionExplanation");

const cards = document.querySelectorAll(".card");
const flowSteps = document.querySelectorAll(".flow-step");
const tabs = document.querySelectorAll(".tab");

/*=========================
    VECTOR TAB HANDLERS
=========================*/

function setupVectorTabs(){
    tabs.forEach(tab=>{
        tab.addEventListener('click',()=>{
            tabs.forEach(t=>t.classList.remove('active'));
            tab.classList.add('active');
            renderVectorTab(tab.dataset.tab);
        });
    });
}

function getBow(filtered){
    const bow={};
    filtered.forEach(w=>bow[w]=(bow[w]||0)+1);
    return bow;
}

function renderVectorTab(kind){
    const data = window.pipelineData || {};
    const filtered = data.filtered || [];
    if(kind==='bow'){
        renderBOW(getBow(filtered));
    }else if(kind==='tfidf'){
        renderTFIDF(filtered);
    }else if(kind==='embedding'){
        renderEmbedding(filtered);
    }
}

function renderBOW(bow){
    let html = `\n<table class="vector-table">\n<tr><th>Word</th><th>Count</th></tr>`;
    for(const word in bow){
        html+=`\n<tr><td>${word}</td><td>${bow[word]}</td></tr>`;
    }
    html+=`\n</table>`;
    vectorContent.innerHTML = html;
}

function renderTFIDF(filtered){
    // Build a small corpus using the sample sentences + current cleaned text (if available)
    const corpus = samples.slice();
    if(window.pipelineData && window.pipelineData.cleaned){
        corpus.push(window.pipelineData.cleaned);
    }
    const docs = corpus.map(d=>{
        // simple normalization
        return d.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
    });
    const N = docs.length;
    // document frequency
    const df = {};
    docs.forEach(doc=>{
        const seen = new Set(doc);
        seen.forEach(w=>df[w]=(df[w]||0)+1);
    });
    // term freq for current filtered doc
    const tf = {};
    filtered.forEach(w=>tf[w]=(tf[w]||0)+1);

    const rows = Object.keys(tf).map(w=>{
        const termFreq = tf[w];
        const docFreq = df[w]||0;
        const idf = Math.log((N+1)/(docFreq+1)) + 1; // smoothed idf
        const score = termFreq * idf;
        return {w,termFreq,docFreq,idf,score};
    }).sort((a,b)=>b.score-a.score);

    let html = `\n<table class="vector-table">\n<tr><th>Word</th><th>TF</th><th>DF</th><th>IDF</th><th>TF-IDF</th></tr>`;
    rows.forEach(r=>{
        html+=`\n<tr><td>${r.w}</td><td>${r.termFreq}</td><td>${r.docFreq}</td><td>${r.idf.toFixed(2)}</td><td>${r.score.toFixed(3)}</td></tr>`;
    });
    html+=`\n</table>`;
    vectorContent.innerHTML = html;
}

function simpleHashEmbedding(word, dim=6){
    const primes=[3,5,7,11,13,17,19,23];
    const out = [];
    for(let i=0;i<dim;i++){
        let acc = 0;
        for(let j=0;j<word.length;j++){
            acc += word.charCodeAt(j) * primes[(i+j)%primes.length];
        }
        // normalize to -1..1
        const v = Math.sin(acc) ;
        out.push(Number(v.toFixed(3)));
    }
    return out;
}

function renderEmbedding(filtered){
    if(filtered.length===0){
        vectorContent.innerHTML = '<div class="vector-placeholder">No words to embed.</div>';
        return;
    }
    let html = `\n<table class="vector-table">\n<tr><th>Word</th><th>Embedding</th></tr>`;
    filtered.forEach(w=>{
        const vec = simpleHashEmbedding(w,8);
        html+=`\n<tr><td>${w}</td><td>[${vec.join(', ')}]</td></tr>`;
    });
    html+=`\n</table>`;
    vectorContent.innerHTML = html;
}

// Initialize vector tab handlers and render the active tab
setupVectorTabs();
const _initialTab = document.querySelector('.tab.active')?.dataset.tab || 'bow';
renderVectorTab(_initialTab);

/*=========================
    SAMPLE SENTENCES
=========================*/

const samples = [

"I love playing Cricket 🏏 in sunny days!!",

"The movie was absolutely amazing and I enjoyed every minute of it.",

"I hate waking up early in the morning.",

"Natural Language Processing is one of the most exciting fields of Artificial Intelligence.",

"The food was terrible and the service was disappointing."

];

/*=========================
    STOP WORDS
=========================*/

const stopWords = new Set([

"a",
"an",
"the",
"is",
"am",
"are",
"was",
"were",
"be",
"been",
"being",
"of",
"to",
"in",
"on",
"at",
"for",
"with",
"from",
"into",
"by",
"and",
"or",
"but",
"if",
"then",
"this",
"that",
"these",
"those",
"it",
"its",
"he",
"she",
"they",
"them",
"their",
"you",
"your",
"we",
"our",
"i",
"me",
"my"

]);

/*=========================
    STEM + LEMMA DICTIONARY
=========================*/

const stemMap = {
    playing: "play",
    played: "play",
    plays: "play",
    running: "run",
    ran: "run",
    runs: "run",
    walking: "walk",
    walked: "walk",
    walks: "walk",
    talking: "talk",
    talked: "talk",
    talks: "talk",
    eating: "eat",
    ate: "eat",
    eats: "eat",
    sleeping: "sleep",
    slept: "sleep",
    sleeps: "sleep",
    going: "go",
    went: "go",
    goes: "go",
    coming: "come",
    came: "come",
    comes: "come",
    doing: "do",
    did: "do",
    does: "do",
    making: "make",
    made: "make",
    makes: "make",
    seeing: "see",
    saw: "see",
    sees: "see",
    saying: "say",
    said: "say",
    says: "say",
    reading: "read",
    reads: "read",
    writing: "write",
    wrote: "write",
    written: "write",
    buying: "buy",
    bought: "buy",
    buys: "buy"
};

const lemmaMap = {
    playing: "play",
    played: "play",
    plays: "play",
    running: "run",
    ran: "run",
    runs: "run",
    walking: "walk",
    walked: "walk",
    walks: "walk",
    talking: "talk",
    talked: "talk",
    talks: "talk",
    eating: "eat",
    ate: "eat",
    eats: "eat",
    sleeping: "sleep",
    slept: "sleep",
    sleeps: "sleep",
    going: "go",
    went: "go",
    goes: "go",
    coming: "come",
    came: "come",
    comes: "come",
    doing: "do",
    did: "do",
    does: "do",
    making: "make",
    made: "make",
    makes: "make",
    seeing: "see",
    saw: "see",
    sees: "see",
    saying: "say",
    said: "say",
    says: "say",
    reading: "read",
    reads: "read",
    writing: "write",
    wrote: "write",
    written: "write",
    buying: "buy",
    bought: "buy",
    buys: "buy",
    days: "day",
    years: "year",
    months: "month",
    weeks: "week",
    boys: "boy",
    girls: "girl",
    children: "child",
    mice: "mouse",
    feet: "foot",
    geese: "goose",
    men: "man",
    women: "woman",
    cars: "car",
    dogs: "dog",
    cats: "cat",
    birds: "bird",
    better: "good",
    best: "good",
    are: "be",
    is: "be",
    am: "be",
    was: "be",
    were: "be",
    being: "be",
    been: "be"
};

const stemExceptions = new Set([
    "morning",
    "evening",
    "afternoon",
    "building",
    "clothing",
    "something",
    "anything",
    "nothing",
    "everything",
    "thing"
]);

/*=========================
    SAMPLE BUTTON
=========================*/

sampleBtn.addEventListener("click",()=>{

const random=Math.floor(Math.random()*samples.length);

inputText.value=samples[random];

});

/*=========================
    CLEAR BUTTON
=========================*/

clearBtn.addEventListener("click",()=>{

    inputText.value="";
    resetUI();

});

/*=========================
    PROCESS BUTTON
=========================*/

processBtn.addEventListener("click",()=>{

const text=inputText.value.trim();

if(text===""){

alert("Please enter some text.");

return;

}

processPipeline(text);

});

/*=========================
    MAIN PIPELINE
=========================*/

function resetUI(){
    hideCards();
    flowSteps.forEach(step=>step.classList.remove("active"));
    cleanedOutput.textContent="";
    tokenOutput.innerHTML="";
    stemTable.innerHTML="";
    lemmaTable.innerHTML="";
    remainingWords.innerHTML="";
    removedWords.innerHTML="";
    vectorContent.innerHTML="";
    predictionResult.textContent="Waiting...";
    confidenceValue.textContent="0%";
    confidenceFill.style.width = "0%";
    predictionBadge.textContent = "Neutral";
    predictionBadge.className = "prediction-badge neutral";
    predictionEmoji.textContent = "🤖";
    positiveCount.textContent = "0";
    negativeCount.textContent = "0";
    keywordsList.textContent = "none";
    predictionExplanation.textContent = "Prediction will appear once the text has been analyzed.";
    window.pipelineData = {};
}

/*==================================================
    PART 1B
    CLEANING + TOKENIZATION + UI HELPERS
==================================================*/

/*=========================
    TEXT CLEANING
=========================*/

function cleanText(text){

    return text

        // Lowercase
        .toLowerCase()

        // Remove URLs
        .replace(/https?:\/\/\S+/g,"")

        // Remove HTML Tags
        .replace(/<[^>]*>/g,"")

        // Remove Emojis
        .replace(/[\u{1F300}-\u{1FAFF}]/gu,"")

        // Remove Punctuation
        .replace(/[^\w\s]/g,"")

        // Remove Numbers
        .replace(/\d+/g,"")

        // Remove Extra Spaces
        .replace(/\s+/g," ")

        .trim();

}

/*=========================
    TOKENIZATION
=========================*/

function tokenize(text){

    if(text==="") return [];

    return text.split(" ");

}

/*=========================
    PORTER-LIKE STEMMER
=========================*/

function stemWords(tokens){
    return tokens.map(rawWord => {
        const word = rawWord.toLowerCase();

        if (stemExceptions.has(word)) {
            return word;
        }

        if (stemMap[word]) {
            return stemMap[word];
        }

        if (word.endsWith("ies") && word.length > 4) {
            return word.slice(0, -3) + "y";
        }

        if (word.endsWith("ing") && word.length > 5) {
            let root = word.slice(0, -3);
            if (root.endsWith("ie")) {
                root = root.slice(0, -2) + "y";
            }
            if (/([bcdfghjklmnpqrstvwxyz])\1$/.test(root)) {
                root = root.slice(0, -1);
            }
            if (root.length >= 4 && /[aeiou]/.test(root)) {
                return root;
            }
        }

        if (word.endsWith("ed") && word.length > 4) {
            let root = word.slice(0, -2);
            if (root.endsWith("i")) {
                root = root.slice(0, -1) + "y";
            }
            if (root.length >= 3 && /[aeiou]/.test(root)) {
                return root;
            }
        }

        if (word.endsWith("es") && word.length > 4) {
            const root = word.slice(0, -2);
            if (root.length >= 3) {
                return root;
            }
        }

        if (word.endsWith("s") && word.length > 3) {
            const root = word.slice(0, -1);
            if (root.length >= 3) {
                return root;
            }
        }

        return word;
    });
}

/*=========================
    LEMMATIZATION
=========================*/ 

function lemmatizeWords(tokens){
    return tokens.map(rawWord => {
        const word = rawWord.toLowerCase();
        if (lemmaMap[word]) {
            return lemmaMap[word];
        }

        if (word.endsWith("ies") && word.length > 4) {
            return word.slice(0, -3) + "y";
        }

        if (word.endsWith("ing") && word.length > 5 && !stemExceptions.has(word)) {
            let root = word.slice(0, -3);
            if (root.endsWith("ie")) {
                root = root.slice(0, -2) + "y";
            }
            if (/([bcdfghjklmnpqrstvwxyz])\1$/.test(root)) {
                root = root.slice(0, -1);
            }
            if (root.length >= 4 && /[aeiou]/.test(root)) {
                return root;
            }
        }

        if (word.endsWith("ed") && word.length > 4) {
            let root = word.slice(0, -2);
            if (root.endsWith("i")) {
                root = root.slice(0, -1) + "y";
            }
            if (root.length >= 3 && /[aeiou]/.test(root)) {
                return root;
            }
        }

        if (word.endsWith("es") && word.length > 4) {
            const root = word.slice(0, -2);
            if (root.length >= 3) {
                return root;
            }
        }

        if (word.endsWith("s") && word.length > 3) {
            const root = word.slice(0, -1);
            if (root.length >= 3) {
                return root;
            }
        }

        return word;
    });
}

/*=========================
    STOP WORD REMOVAL
=========================*/

function removeStopWords(tokens){

    const remaining=[];

    const removed=[];

    tokens.forEach(word=>{

        if(stopWords.has(word)){

            removed.push(word);

        }

        else{

            remaining.push(word);

        }

    });

    return{

        remaining,

        removed

    };

}

/*=========================
    TOKEN CHIP
=========================*/

function createToken(word,color="blue"){

    const span=document.createElement("span");

    span.className="token";

    span.textContent=word;

    if(color==="green"){

        span.style.background="#16A34A";

    }

    if(color==="red"){

        span.style.background="#DC2626";

    }

    return span;

}

/*=========================
    SHOW CARD
=========================*/

function showCard(card){

    card.classList.remove("hidden");

    card.classList.add("show");

}

/*=========================
    HIDE ALL CARDS
=========================*/

function hideCards(){

    cards.forEach(card=>{

        card.classList.remove("show");

        card.classList.add("hidden");

    });

}

/*=========================
    ACTIVE PIPELINE STEP
=========================*/

function activateStep(index){

    flowSteps.forEach(step=>{

        step.classList.remove("active");

    });

    if(flowSteps[index]){

        flowSteps[index].classList.add("active");

    }

}

/*=========================
    RENDER TOKENS
=========================*/

function renderTokens(container,data,color="blue"){

    container.innerHTML="";

    data.forEach(word=>{

        container.appendChild(

            createToken(word,color)

        );

    });

}

/*=========================
    DELAY
=========================*/

function wait(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });

}

/*==================================================
    PART 1C
    PIPELINE EXECUTION + STEM/LEMMA TABLES
==================================================*/

/*=========================
    STEM TABLE
=========================*/

function renderStemTable(original, stemmed){

    stemTable.innerHTML="";

    original.forEach((word,index)=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${word}</td>

            <td>${stemmed[index]}</td>

        `;

        stemTable.appendChild(row);

    });

}

/*=========================
    LEMMA TABLE
=========================*/

function renderLemmaTable(original, lemma){

    lemmaTable.innerHTML="";

    original.forEach((word,index)=>{

        const row=document.createElement("tr");

        row.innerHTML=`

            <td>${word}</td>

            <td>${lemma[index]}</td>

        `;

        lemmaTable.appendChild(row);

    });

}

/*=========================
    MAIN PIPELINE
=========================*/

async function processPipeline(text){

    resetUI();

    /*----------------------
        RAW TEXT
    ----------------------*/

    activateStep(0);



    /*----------------------
        CLEANING
    ----------------------*/

    activateStep(1);

    const cleaned=cleanText(text);

    cleanedOutput.textContent=cleaned;

    showCard(document.getElementById("cleaningCard"));

    await wait(500);



    /*----------------------
        TOKENIZATION
    ----------------------*/

    activateStep(2);

    const tokens=tokenize(cleaned);

    renderTokens(tokenOutput,tokens);

    showCard(document.getElementById("tokenCard"));

    await wait(500);



    /*----------------------
        STEMMING
    ----------------------*/

    activateStep(3);

    const stemmed=stemWords(tokens);

    renderStemTable(tokens,stemmed);

    showCard(document.getElementById("stemCard"));



    /*----------------------
        LEMMATIZATION
    ----------------------*/

    const lemma=lemmatizeWords(tokens);

    renderLemmaTable(tokens,lemma);

    showCard(document.getElementById("lemmaCard"));

    await wait(600);



    /*----------------------
        STOP WORD REMOVAL
    ----------------------*/

    activateStep(4);

    const stopData=removeStopWords(lemma);

    renderTokens(

        remainingWords,

        stopData.remaining,

        "green"

    );

    renderTokens(

        removedWords,

        stopData.removed,

        "red"

    );

    showCard(document.getElementById("stopCard"));

    await wait(700);



    /*----------------------
        SAVE FOR PART 2
    ----------------------*/

    window.pipelineData={

        original:text,

        cleaned,

        tokens,

        stemmed,

        lemma,

        filtered:stopData.remaining,

        removed:stopData.removed

    };



    /*----------------------
        CALL PART 2
    ----------------------*/

    /*----------------------
        VECTORIZATION
    ----------------------*/

    activateStep(5);

    // Render the currently active vector tab (BOW / TF-IDF / Embedding)
    const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'bow';
    renderVectorTab(activeTab);

    showCard(document.getElementById("vectorCard"));

    await wait(700);



/*----------------------
    PREDICTION
----------------------*/

    activateStep(6);

    const positiveWords = ['love', 'good', 'amazing', 'happy'];
    const negativeWords = ['hate', 'bad', 'disappointing', 'terrible'];
    let score = 0;
    const positiveMatches = [];
    const negativeMatches = [];

    stopData.remaining.forEach(token => {
        const word = token.toLowerCase();
        if (positiveWords.includes(word)) {
            score += 1;
            positiveMatches.push(word);
        }
        if (negativeWords.includes(word)) {
            score -= 1;
            negativeMatches.push(word);
        }
    });

    const sentiment = score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
    const emoji = score > 0 ? '😄' : score < 0 ? '😞' : '😐';

    predictionResult.textContent = `${sentiment} Sentiment`;
    predictionEmoji.textContent = emoji;
    predictionBadge.textContent = sentiment;
    predictionBadge.className = `prediction-badge ${sentiment.toLowerCase()}`;

    const uniqueKeywords = [...new Set([...positiveMatches, ...negativeMatches])];
    positiveCount.textContent = positiveMatches.length;
    negativeCount.textContent = negativeMatches.length;
    keywordsList.textContent = uniqueKeywords.length ? uniqueKeywords.join(', ') : 'none';

    let explanation = 'Prediction is neutral because the text contains a balanced sentiment mix.';
    if (score > 0) {
        explanation = 'Prediction is positive because the text contains more positive than negative sentiment words.';
    } else if (score < 0) {
        explanation = 'Prediction is negative because the text contains more negative than positive sentiment words.';
    }
    predictionExplanation.textContent = explanation;

    const confidence = Math.min(100, Math.max(35, 50 + Math.abs(score) * 20));
    confidenceValue.textContent = `${confidence}%`;
    confidenceFill.style.width = '0%';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            confidenceFill.style.width = `${confidence}%`;
        });
    });

    showCard(document.getElementById('predictionCard'));

}

