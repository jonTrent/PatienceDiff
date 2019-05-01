# PatienceDiff
A javascript implementation of the Patience Diff algorithm, credited to Bram Cohen of Bittorrent fame. The article by "Alfedenzo" at https://alfedenzo.livejournal.com/170301.html was of immense help understanding the key Longest Common Subsequence algorithm, and is also the source of the sample data embedded in the HTML document.

# Use
<b>patienceDiff(aLines, bLines)</b>

where:<br>
* aLines = array of the original lines of text.
* bLines = array of the new lines of text.
    
returns array of objects, with properties of:<br>
* line = line of text from either aLines or bLines.
* aIndex = index of line of text in aLines, or -1 if line is added from bLines.
* bIndex = index of line of text in bLines, or -1 if line is deleted from aLines.

