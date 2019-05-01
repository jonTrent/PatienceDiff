# PatienceDiff
A javascript implementation, suitable for use within a browser, of the Patience Diff algorithm, which is credited to Bram Cohen of Bittorrent fame. The article by "Alfedenzo" at https://alfedenzo.livejournal.com/170301.html was of immense help understanding the key Longest Common Subsequence (LCS) algorithm, and is also the source of the data embedded in the HTML document.

# Example
Simply download the PatienceDiff.js file which contains the complete algorith, and PatienceDiff.html which exemplifies how to use the algorithm.

# Use
<b>result[] = patienceDiff(aLines[], bLines[])</b>

where:<br>
* aLines = array of the original lines of text.
* bLines = array of the new lines of text.
    
returns array of objects, with properties of:<br>
* line = line of text from either aLines or bLines.
* aIndex = index of line of text in aLines, or -1 if line is added from bLines.
* bIndex = index of line of text in bLines, or -1 if line is deleted from aLines.
