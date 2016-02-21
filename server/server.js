'use strict';

const express = require('express');
const fs = require('fs');
const request = require('request');
const app = express();

let data = fs.readFileSync('chains.json');
let chains = JSON.parse(data);
let longest = 0;
chains.forEach(function(song) {
  let countWords = song.split(' ').length;
  longest = (countWords > longest) ? countWords : longest;
});
console.log(longest);
do {
  let starts = firstWords(chains);
  let ends = lastWords(chains);
  let matches = matchingWords(starts, ends);
  chains = combineSongs(matches, chains);
  //console.log(starts, ends, matches);
  //console.log(chains);
  console.log(chains.length);
  fs.writeFile('chains.json', JSON.stringify(chains), function(err) {
    console.log('File successfully written!');
  });
} while (false);
console.log('done');

function firstWords(songs) {
  let startWords = [];
  for (var i = 0; i < songs.length; i++) {
    let matches = songs[i].match(/^(\w+|\d+)\b/);
    startWords.push(matches[0]);
  }
  return startWords;
}

function lastWords(songs) {
  let endWords = [];
  for (var i = 0; i < songs.length; i++) {
    let matches = songs[i].match(/\b(\w+|\d+)$/);
    endWords.push(matches[0]);
  }
  return endWords;
}

function matchingWords(startWords, endWords) {
  let matchWords = [];
  for (var i = 1; i < startWords.length; i++) {
    for (var j = 0; j < endWords.length; j++) {
      if (startWords[i].toLowerCase() === endWords[j].toLowerCase() && i !== j) {
        matchWords.push({i: i, iWord: startWords[i], j: j, jWord: endWords[j]});
      }
    }
  }
  return matchWords;
}

function combineSongs(matches, songs) {
  let songsTogether = [];
  for (var k = 0; k < matches.length; k++) {
    let match = matches[k];
    let jMatch = songs[match.j];
    let iMatch = songs[match.i];
    if (jMatch.toLowerCase() !== iMatch.toLowerCase()) {
      let re = new RegExp(match.jWord + '$');
      let replacedWords = jMatch.replace(re, iMatch);
      if (jMatch !== replacedWords || iMatch !== replacedWords) {
        songsTogether.push(replacedWords);
      }
    }
  }
  return arrayUnique(songsTogether);
}

function arrayUnique(a) {
  return a.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
}
