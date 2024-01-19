const Match = require("./model/match");
const lettersMistakeList = require("./script/letters")

class StringMatcher {
    constructor({ ngram = 2, lettersMistake = false } = {}) {
        this.ngram = ngram;
        this.lettersMistake = lettersMistake;
    }

    #validator = function(targetString, targetList) {
        if (typeof targetString !== 'string') throw new Error("targetString must be 'string'");
        if (!Array.isArray(targetList)) throw new Error("targetList must be 'array of strings'");
        if (!targetList.length) throw new Error("targetList must not be empty");
        if (targetList.find( function (s) { return typeof s !== 'string'})) throw new Error("elements in the targetList must be 'string'");
    }

    #findLettersMistake = function (bigramArr, i) {
        let size = 0;
        for (let j = i + 1; j < bigramArr.length; j++) {
            if (bigramArr[i][1]["index"] === bigramArr[j][1]["index"] &&  bigramArr[i][1]["matchedCount"] === 1 && bigramArr[j][1]["matchedCount"] === 1) {
                for (let s = 0; s < this.ngram; s++) {
                    size += bigramArr[i][0][s] === bigramArr[j][0][s] ? .25 : lettersMistakeList[bigramArr[i][0][s]].includes(bigramArr[j][0][s]) ? .075 : 0;
                }
            }
        }
        return size;
    }

    matchStrings = function (str1, str2) {
        str1 = str1.replace(/\s+/g, '');
        str2 = str2.replace(/\s+/g, '');
    
        if (str1 === str2) return 1; if (str1.length < 2 || str2.length < 2) return 0;
        
        const bigramMap = new Map();
        for (let i = 0; i < str1.length - 1; i++) {
            const bg = str1.substring(i, i + this.ngram);
            bigramMap.set(bg, bigramMap.has(bg) ? new Match(bigramMap.get(bg)["index"], -1, bigramMap.get(bg)["matchedCount"] + 1) : new Match(i, -1, 1))
        }
    
        for (let i = 0; i < str2.length - 1; i++) {
            const bg = str2.substring(i, i + this.ngram);
            bigramMap.set(bg, bigramMap.has(bg) ?  new Match(bigramMap.get(bg)["index"], i, bigramMap.get(bg)["matchedCount"] - 1) : new Match(i, -1, 1))
        }
    
        let size = 0;
        const bigramArr = Array.from(bigramMap);
        for (let i = 0; i < bigramArr.length; i++) {
            size += (bigramArr[i][1]["matchedCount"] === 0 ? 1 : 0) + (this.lettersMistake ? this.#findLettersMistake(bigramArr, i) : 0);
        }
    
        return (this.ngram * size) / (str1.length + str2.length - this.ngram);
    }

    findBestMatch = function(targetString, targetList) {
        this.#validator(targetString, targetList);
        const ratings = [];
        targetList.forEach(element => { ratings.push({ value: element, rate: this.matchStrings(targetString, element)}) });
        return ratings.sort((a, b) => b.rate - a.rate);
    }
}

module.exports = StringMatcher;