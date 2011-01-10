SourceKit
=========
A Textmate like lightweight programmer's text editor right inside of Chrome. It saves files directly to Dropbox, so if you have the Dropbox sync software installed, the changes will appear locally as if you did so with a text editor! Changes will be stored remotely so naturally this same extension will pull up the same copy of the file everywhere!

REPORT ISSUES HERE: https://github.com/kenotron/sourcekit/issues

Embedded is the excellent Mozilla Bespin (SkyWriter) text editor component. This allows for a very natural text editing experience while retaining Chrome's amazing JavaScript performance.

CHANGELOG
---------

### 0.3.8 ###
* Utilize Bespin's buffers when switching tabs
* Fixes undo / redo functionality (so the undo history is not mixed between tabs!!!)
* Added a "lock" so one cannot click on multiple files while the first file is being loaded
* Much better looking "Options" page

### 0.3.7 ###
* Fixed a bug about opening files with spaces in them
* Can create files / folders with the file list on the left
* Added default page so the app is less "bare" when started

### 0.3.6 ###
* BUG FIX... had a typo in the last release

### 0.3.5 ###
* Tabbed interface!
* Added support for C#, and CoffeeScript

### 0.3.4 ###
* Added a syntax highlighting support for many different languages including: C/C++, Ruby, Python, PHP, HTML, JavaScript, Java
* The file list is sorted now (on open)

### 0.3.3 ###
* Applied to Dropbox for production application status! (pending approval!!!)
* Renamed to SourceKit * too many ChromePad's and too Chrome specific

### 0.3.1 ###
* First public release!