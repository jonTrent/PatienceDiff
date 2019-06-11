
/**
 * @fileOverview patienceDiff algorithm implemented in javascript.
 * @author Jonathan Trent
 * @version 1.0
 *
 * @function patienceDiff
 * @param {string[]} aLines Old array of text lines.
 * @param {string[]} bLines New array of text lines.
 *
 * @returns {object[]} Returns an array of objects with attributes of
 * "line", "aIndex", and "bIndex".  The line is text from either aLines
 * or bLines, with aIndex and bIndex referencing the original index. If
 * aIndex === -1 then the line is new from bLines, and if bIndex === -1
 * then the line is old from aLines.
 *
 */

function patienceDiff(aLines, bLines) {
   
  //
  // findUnique finds all unique values in arr[lo..hi], inclusive.  This
  // function is used in preparation for determining the longest common
  // subsequence.  Specifically, it first reduces the array range in question
  // to unique values.
  //
  // Returns an ordered Map, with the arr[i] value as the Map key and the
  // array index i as the Map value.
  // 
  function findUnique(arr, lo, hi) {
    
    var lineMap = new Map();
    
    for (let i = lo; i <= hi; i++) {
      let line = arr[i];
      if (lineMap.has(line)) {
        lineMap.get(line).count++;
        lineMap.get(line).index = i;
      } else {
        lineMap.set(line, {count:1, index: i});
      }  
    }
    
    lineMap.forEach((val, key, map) => {
      if (val.count !== 1) {
        map.delete(key);
      } else {
        map.set(key, val.index);
      }
    });
    
    return lineMap;
  }

  //
  // uniqueCommon finds all the unique common entries between aArray[aLo..aHi]
  // and bArray[bLo..bHi], inclusive.  This function uses findUnique to pare
  // down the aArray and bArray ranges first, before then walking the comparison
  // between the two arrays.
  //
  // Returns an ordered Map, with the Map key as the common line between aArray
  // and bArray, with the Map value as an object containing the array indexes of 
  // the matching unique lines.
  //
  function uniqueCommon(aArray, aLo, aHi, bArray, bLo, bHi) {
    let ma = findUnique(aArray, aLo, aHi);
    let mb = findUnique(bArray, bLo, bHi);
    
    ma.forEach((val, key, map) => {
      if (mb.has(key)) {
        map.set(key, {indexA: val, indexB: mb.get(key)});
      } else {
        map.delete(key);
      }
    });
    
    return ma;
  }

  //
  // longestCommonSubsequence takes an ordered Map from the function uniqueCommon
  // and determines the Longest Common Subsequence (LCS).
  //
  // Returns an ordered array of objects containing the array indexes of the 
  // matching lines for a LCS.
  //
  function longestCommonSubsequence(abMap) {
    
    var ja = [];
    
    // First, walk the list creating the jagged array.
    abMap.forEach((val, key, map) => {
      let i = 0;
      while (ja[i] && ja[i][ja[i].length-1].indexB < val.indexB) {
        i++;
      }
      
      if (!ja[i]) {
        ja[i] = [];
      }

      if (0 < i) {
        val.prev = ja[i-1][ja[i-1].length - 1];
      }

      ja[i].push(val);
    });
    
    // Now, pull out the longest common subsequence.
    var lcs = [];
    if (0 < ja.length) {
      let n = ja.length - 1;
      var lcs = [ja[n][ja[n].length - 1]];
      while (lcs[lcs.length - 1].prev) {
        lcs.push(lcs[lcs.length - 1].prev);
      }
    }
    
    return lcs.reverse();
  }

  // "result" is the arracy used to accumulate the aLines that are removed, the
  // lines that are shared between aLines and bLines, and the bLines that were
  // added.
  let result = [];
  let removed = 0;
  let added = 0;
  
  //
  // addToResult simply pushes the latest value onto the "result" array.  This
  // array captures the diff of the line, aIndex, and bIndex from the aLines
  // and bLines array.
  //
  function addToResult(aIndex, bIndex) {
    removed += (bIndex < 0) ? 1 : 0;
    added += (aIndex < 0) ? 1 : 0;
    result.push({line: 0 <= aIndex ? aLines[aIndex] : bLines[bIndex], aIndex: aIndex, bIndex: bIndex});
  }
  
  //
  // addSubMatch handles the lines between a pair of entries in the LCS.  Thus,
  // this function might recursively call recurseLCS to further match the lines
  // between aLines and bLines.
  //
  function addSubMatch(aLo, aHi, bLo, bHi) {
    
    // Match any lines at the beginning of aLines and bLines.
    while (aLo <= aHi && bLo <= bHi && aLines[aLo] === bLines[bLo]) {
      addToResult(aLo++, bLo++);
    }

    // Match any lines at the end of aLines and bLines, but don't place them
    // in the "result" array just yet, as the lines between these matches at
    // the beginning and the end need to be analyzed first.
    let aHiTemp = aHi;
    while (aLo <= aHi && bLo <= bHi && aLines[aHi] === bLines[bHi]) {
      aHi--;
      bHi--;
    }
    
    // Now, check to determine with the remaining lines in the subsequence
    // whether there are any unique common lines between aLines and bLines.
    //
    // If not, add the subsequence to the result (all aLines having been
    // removed, and all bLines having been added).
    //
    // If there are unique common lines between aLines and bLines, then let's
    // recursively perform the patience diff on the subsequence.
    let uniqueCommonMap = uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi);
    if (uniqueCommonMap.size === 0) {
      while (aLo <= aHi) {
        addToResult(aLo++, -1);
      }
      while (bLo <= bHi) {
        addToResult(-1, bLo++);
      }    
    } else {
      recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap);
    }
    
    // Finally, let's add the matches at the end to the result.
    while (aHi < aHiTemp) {
      addToResult(++aHi, ++bHi);
    } 
  }

  //
  // recurseLCS finds the longest common subsequence (LCS) between the arrays
  // aLines[aLo..aHi] and bLines[bLo..bHi] inclusive.  Then for each subsequence
  // recursively performs another LCS search (via addSubMatch), until there are
  // none found, at which point the subsequence is dumped to the result.
  //
  function recurseLCS(aLo, aHi, bLo, bHi, uniqueCommonMap) {
    var x = longestCommonSubsequence(uniqueCommonMap || uniqueCommon(aLines, aLo, aHi, bLines, bLo, bHi));
    if (x.length === 0) {
      addSubMatch(aLo, aHi, bLo, bHi);
    } else {
      if (aLo < x[0].indexA || bLo < x[0].indexB) {
        addSubMatch(aLo, x[0].indexA-1, bLo, x[0].indexB-1);
      }

      let i;
      for (i = 0; i < x.length - 1; i++) {
        addSubMatch(x[i].indexA, x[i+1].indexA-1, x[i].indexB, x[i+1].indexB-1);
      }
      
      if (x[i].indexA <= aHi || x[i].indexB <= bHi) {
        addSubMatch(x[i].indexA, aHi, x[i].indexB, bHi);
      }
    }
  }
  
  recurseLCS(0, aLines.length-1, 0, bLines.length-1);
  
  return {lines: result, lineCountRemoved: removed, lineCountAdded: added};
}
