interface Resources {
  "bot": {
    "autocomplete": {
      "trackName": "{{title}} [Author: {{author}}]"
    },
    "commands": {
      "back": {
        "metadata": {
          "name": "back",
          "description": "Go back to previous track or specified position in history.",
          "options": {
            "position": {
              "name": "position",
              "description": "The position in history to go back to."
            }
          }
        }
      },
      "filters": {
        "metadata": {
          "name": "filters",
          "description": "Toggle various audio filters.",
          "options": {
            "type": {
              "name": "type",
              "description": "Audio filter type to use."
            }
          }
        }
      },
      "guilds": {
        "metadata": {
          "name": "guilds",
          "description": "Show the top 25 guilds by member count."
        }
      },
      "help": {
        "metadata": {
          "name": "help",
          "description": "Show the list of bot commands."
        },
        "listTitle": "{{icon}} **List of commands**",
        "supportServerCallout": "{{icon}} **Support server**\nJoin the support server for help or to suggest improvements:\n{{invite}}",
        "addBotCallout": "{{icon}} **Enjoying {{botName}}?**\nAdd me to another server:\n**[Click me!]({{invite}})**"
      },
      "history": {
        "metadata": {
          "name": "history",
          "description": "Show history of tracks that have been played.",
          "options": {
            "page": {
              "name": "page",
              "description": "Page number to display for the history."
            }
          }
        }
      },
      "join": {
        "metadata": {
          "name": "join",
          "description": "The bot will join the voice channel if not already in one."
        }
      },
      "leave": {
        "metadata": {
          "name": "leave",
          "description": "Clear the queue and remove bot from voice channel."
        }
      },
      "loop": {
        "metadata": {
          "name": "loop",
          "description": "Toggle looping a track, the whole queue or autoplay.",
          "options": {
            "mode": {
              "name": "mode",
              "description": "Loop mode: Track, queue, autoplay or disabled."
            }
          }
        }
      },
      "lyrics": {
        "metadata": {
          "name": "lyrics",
          "description": "Search Genius lyrics for current or specified track.",
          "options": {
            "query": {
              "name": "query",
              "description": "Search query by text or URL."
            }
          }
        },
        "autocompleteSearchResult": "{{title}} [Artist: {{artist}}]"
      },
      "move": {
        "metadata": {
          "name": "move",
          "description": "Move a track to a specified position in queue.",
          "options": {
            "from": {
              "name": "from",
              "description": "The position of the track to move."
            },
            "to": {
              "name": "to",
              "description": "The position to move the track to."
            }
          }
        }
      },
      "nowplaying": {
        "metadata": {
          "name": "nowplaying",
          "description": "Show information about the current track."
        }
      },
      "pause": {
        "metadata": {
          "name": "pause",
          "description": "Toggle pause for the current track."
        }
      },
      "play": {
        "metadata": {
          "name": "play",
          "description": "Add a track or playlist to the queue by search query or URL.",
          "options": {
            "query": {
              "name": "query",
              "description": "Search query by text or URL."
            }
          }
        }
      },
      "queue": {
        "metadata": {
          "name": "queue",
          "description": "Show tracks that have been added to the queue.",
          "options": {
            "page": {
              "name": "page",
              "description": "Page number to display for the queue."
            }
          }
        }
      },
      "reload": {
        "metadata": {
          "name": "reload",
          "description": "Reload slash command, autocomplete and component interactions across shards."
        }
      },
      "seek": {
        "metadata": {
          "name": "seek",
          "description": "Seek to a position in the current track.",
          "options": {
            "duration": {
              "name": "duration",
              "description": "Duration in format 00:00:00 (HH:mm:ss)."
            }
          }
        }
      },
      "shards": {
        "metadata": {
          "name": "shards",
          "description": "Show information about all connected shards.",
          "options": {
            "sort": {
              "name": "sort",
              "description": "What to sort the shards by."
            },
            "page": {
              "name": "page",
              "description": "Page number to display for the shards."
            }
          }
        }
      },
      "shuffle": {
        "metadata": {
          "name": "shuffle",
          "description": "Randomly shuffle all tracks in the queue."
        }
      },
      "skip": {
        "metadata": {
          "name": "skip",
          "description": "Skip track to next or specified position in queue.",
          "options": {
            "position": {
              "name": "position",
              "description": "The position in queue to skip to."
            }
          }
        }
      },
      "status": {
        "metadata": {
          "name": "status",
          "description": "Show operational status of the bot."
        }
      },
      "stop": {
        "metadata": {
          "name": "stop",
          "description": "Clear the queue and stop playing audio."
        }
      },
      "systemstatus": {
        "metadata": {
          "name": "systemstatus",
          "description": "Show operational status of the bot with additional technical information."
        }
      },
      "volume": {
        "metadata": {
          "name": "volume",
          "description": "Show or change the playback volume for tracks.",
          "options": {
            "percentage": {
              "name": "percentage",
              "description": "Volume percentage: From 1% to 100%."
            }
          }
        }
      }
    },
    "statistics": {
      "botStatus": {
        "title": "{{icon}} **Bot status**",
        "joinedServers": "**{{count}}** Joined servers",
        "joinedServers_one": "**1** Joined server",
        "totalMembers": "**{{count}}** Total members",
        "releaseVersion": "**{{version}}** Release version"
      },
      "queueStatus": {
        "title": "{{icon}} **Queue status**",
        "voiceConnections": "**{{count}}** Voice connections",
        "voiceConnections_one": "**1** Voice connection",
        "tracksInQueues": "**{{count}}** Tracks in queues",
        "tracksInQueues_one": "**1** Track in queues",
        "usersListening": "**{{count}}** Users listening",
        "usersListening_one": "**1** User listening"
      },
      "systemStatus": {
        "title": "{{icon}} **System status**",
        "uptime": "**{{value}}** Uptime",
        "cpu": "**{{value, number(minimumFractionDigits: 2)}}%** CPU usage",
        "cpuDetailed": "**{{usage}}% @ {{cores}} cores** CPU usage",
        "memory": "**{{value, number}} MB** Memory usage",
        "memoryDetailed": "**{{used, number}} / {{total, number}} MB** Memory usage",
        "platform": "**{{value}}** Platform"
      },
      "discordStatus": {
        "title": "{{icon}} **Discord status**",
        "apiLatency": "**{{value, number}} ms** Discord API latency"
      },
      "dependencies": {
        "title": "{{icon}} **Dependencies**"
      }
    }
  }
}

export default Resources;
