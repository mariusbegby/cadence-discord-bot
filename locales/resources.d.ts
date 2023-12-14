interface Resources {
  "bot": {
    "autocomplete": {
      "trackName": "{{title}} [Author: {{author}}]"
    },
    "commands": {
      "lyrics": {
        "metadata": {
          "description": "Search Genius lyrics for current or specified track. TEST",
          "name": "lyrics",
          "options": {
            "query": {
              "name": "query",
              "description": "Search query by text or URL. TEST"
            }
          }
        },
        "autocompleteSearchResult": "{{title}} [Artist: {{artist}}]"
      },
      "help": {}
    }
  }
}

export default Resources;
