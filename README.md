# word-matcher
Calculate the similarity between two words with "Jaccard Index". This method gives the best results.
Look: [Jaccard Index](https://en.wikipedia.org/wiki/Jaccard_index)

It also provides additional support against typos when using the keyboard of mobile devices.

# install
```
npm install word-matcher
```

# usage

```
const WordMatcher = require("word-matcher")
...

const matcher = new WordMatcher();
```

### options

```
WordMatcher({ngram = 2, lettersMistake = false}) // default

// ngram == 2 => "lion" ["li", "io", "on"]
// ngram == 3 => "lion" ["lio", "ion"]

// lettersMistake => can be used for errors when using the keyboard of mobile devices.
```

### findBestMatch
```
// word => "lipstck"
// list => ["wallet","keys","phone","lipstick","lip balm","hand sanitizer", ...]

matcher.findBestMatch(word, list);

// lettersMistake status false
[
	{"value": "lipstick","rate": 0.7692307692307693}, // <= best match
	{"value": "lip balm","rate": 0.3333333333333333},
	{"value": "hair clip","rate": 0.3076923076923077},
	{"value": "shopping list","rate": 0.23529411764705882},
	...
]

// lettersMistake status true
[
	{"value":  "lipstick","rate":  0.8076923076923077}, // <= best match
	{"value":  "lip balm","rate":  0.3875},
	{"value":  "hair clip","rate":  0.3076923076923077},
	{"value":  "shopping list","rate":  0.2529411764705882},
	...
]
```

### findBestMatch
```
// word1 => "lion"
// word2 => "leon"

matcher.matchStrings(word1, word2);

//lettersMistake status false => 0.3333333333333333
//lettersMistake status true => 0.5
```
