# PatienceDiff
A javascript implementation, suitable for use within a browser, of the Patience Diff algorithm, which is credited to Bram Cohen of Bittorrent fame. The article by "Alfedenzo" at https://alfedenzo.livejournal.com/170301.html was of immense help understanding the key Longest Common Subsequence (LCS) algorithm, and is also the source of the data embedded in the HTML document.

# Example
Simply download the PatienceDiff.js file which contains the complete algorithm, and PatienceDiff.html which exemplifies how to use the algorithm.  Then open PatienceDiff.html in a browser, and press the "=> Diff =>" button to calculate the difference between the two blocks of text.

# Javascript Function Use

<b>result = patienceDiff(aLines, bLines)</b>

where:<br>
* aLines[] = array of strings representing the original lines of text.
* bLines[] = array of strings representing the new lines of text.
    
* result[] = array of objects, with properties of:
  * line = line of text from either aLines or bLines.
  * aIndex = index of original line in aLines, or -1 if line is added from bLines.
  * bIndex = index of new line in bLines, or -1 if line is deleted from aLines.
