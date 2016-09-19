[![Build Status](https://travis-ci.org/CodeMuhammed/Checkpoint1-Inverted-Index.svg?branch=develop)](https://travis-ci.org/CodeMuhammed/Checkpoint1-Inverted-Index)
[![Test Coverage](https://codeclimate.com/github/codeclimate/codeclimate/badges/coverage.svg)](https://codeclimate.com/github/codeclimate/codeclimate/coverage)
[![Code Climate](https://codeclimate.com/github/codeclimate/codeclimate/badges/gpa.svg)](https://codeclimate.com/github/codeclimate/codeclimate)

# Checkpoint1-Inverted-Index
## Overview
### Concept
In computer science, an inverted index (also referred to as postings file or inverted file) is an index data structure storing a mapping from content, such as words or numbers, to its locations in a database file, or in a document or a set of documents (named in contrast to a Forward Index, which maps from documents to content). The purpose of an inverted index is to allow fast full text searches, at a cost of increased processing when a document is added to the database.

###References
[Inverted index - wikipedia.com](https://en.wikipedia.org/wiki/Inverted_index) 

[Inverted index - elastic search](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html) 


## Web Interface
Follow the steps below to run the application locally on your machine.

 NOTE: **You must have a mongoDB instance running on port 127.0.0.1**

 1. Clone the repository: `git clone <REPOSITORY_URL>`
 2. Enter into the apps directory by running `cd Checkpoint1-Inverted-Index`
 3. Install npm packages `npm install`
 4. Run the app by typing `gulp app`



##Tesing

The tests are done using jasmine test runner on the root folder, type gulp
