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
        },
        "trackHistoryEmpty": "{{icon}} **Oops!**\nThe history is empty, add some tracks with {{playCommand}}!",
        "trackPositionHigherThanHistoryLength_one": "{{icon}} **Oops!**\nThere is only **1** track in the history. You cannot go back to track **{{backPosition}}**.\n\nView tracks added in the history with {{historyCommand}}.",
        "trackPositionHigherThanHistoryLength": "{{icon}} **Oops!**\nThere are only **{{count}}** tracks in the history. You cannot go back to track **{{backPosition}}**.\n\nView tracks added in the history with {{historyCommand}}.",
        "trackRecovered": "{{icon}} **Recovered track**\n{{track}}"
      },
      "filters": {
        "metadata": {
          "name": "filters",
          "description": "Toggle various audio filters.",
          "options": {
            "type": {
              "name": "type",
              "description": "Audio filter type to use.",
              "choices": {
                "ffmpeg": "FFmpeg",
                "biquad": "Biquad",
                "equalizer": "Equalizer",
                "disable": "Disable"
              }
            }
          }
        },
        "allFiltersDisabled": "{{icon}} **Disabled filters**\nAll audio filters have been disabled.",
        "disableAllFiltersButton": "Disable all filters",
        "nowUsingFilters": "{{icon}} **Filters toggled**\nNow using these {{mode}} filters:",
        "selectFilterPlaceholder": "Select a filter from the menu.",
        "selectFilterPlaceholderMany": "Select one or multiple filters.",
        "toggleFilterInstructions": "**Toggle filters ({{provider}})**\nEnable or disable audio filters for playback from the menu."
      },
      "guilds": {
        "metadata": {
          "name": "guilds",
          "description": "Show the top 25 guilds by member count."
        },
        "topGuildsByMemberCount": "{{icon}} **Top {{count}} guilds by member count ({{totalCount}} total)**",
        "totalMembers": "**Total members:** **`{{count}`**"
      },
      "help": {
        "metadata": {
          "name": "help",
          "description": "Show the list of bot commands."
        },
        "addBotCallout": "{{icon}} **Enjoying {{botName}}?**\nAdd me to another server:\n**[Click me!]({{invite}})**",
        "listTitle": "{{icon}} **List of commands**",
        "supportServerCallout": "{{icon}} **Support server**\nJoin the support server for help or to suggest improvements:\n{{invite}}"
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
        },
        "emptyHistory": "The history is empty, add some tracks with {{playCommand}}!",
        "invalidPageNumber_one": "{{icon}} **Oops!**\nPage **{{page}}** is not a valid page number.\n\nThere is only **`1`** page in the history.",
        "invalidPageNumber": "{{icon}} **Oops!**\nPage **{{page}}** is not a valid page number.\n\nThere are only a total of **`{{count}}`** pages in the history.",
        "tracksInHistoryTitle": "{{icon}} **Tracks in history**"
      },
      "join": {
        "metadata": {
          "name": "join",
          "description": "The bot will join the voice channel if not already in one."
        },
        "alreadyConnected": "{{icon}} **Oops!**\nI am already connected to the {{channel}} voice channel.\n\nTo disconnect me from the channel, use the {{leaveCommand}} command.",
        "couldNotJoin": "{{icon}} **Oops!**\nCould not join voice channel, please try again.",
        "joinedChannel": "{{icon}} **Joined channel**\nConnected to voice channel: {{channel}}\n\nTo add tracks, use the {{playCommand}} command!"
      },
      "leave": {
        "metadata": {
          "name": "leave",
          "description": "Clear the queue and remove bot from voice channel."
        },
        "leavingChannel": "{{icon}} **Leaving channel**\nCleared the track queue and left voice channel.\n\nTo play more music, use the {{playCommand}} command!"
      },
      "loop": {
        "metadata": {
          "name": "loop",
          "description": "Toggle looping a track, the whole queue or autoplay.",
          "options": {
            "mode": {
              "name": "mode",
              "description": "Loop mode: Track, queue, autoplay or disabled.",
              "choices": {
                "0": "Off",
                "1": "Track",
                "2": "Queue",
                "3": "Autoplay"
              }
            }
          }
        },
        "alreadySet": "{{icon}} **Oops!**\nLoop mode is already **`{{mode}}`**.",
        "loopModeInformation": "{{icon}} **Current loop mode**\nThe looping mode is currently set to **`{{mode}}`**.",
        "modeChanged": "{{icon}} **Loop mode changed**\nChanging loop mode from **`{{fromName}}`** to **`{{toName}}`**.",
        "willAutoplay": "When the queue is empty, similar tracks will start playing!",
        "willNoLongerPlay": "The {{mode}} will no longer play on repeat!",
        "willNowPlay": "The {{mode}} will now play on repeat!"
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
        "autocompleteSearchResult": "{{title}} [Artist: {{artist}}]",
        "lyricsEmbed": "{{icon}} **Showing lyrics**\n**Track: [{{trackTitle}}]({{trackUrl}})**\n**Artist: [{{artistName}}]({{artistUrl}})**",
        "noLyricsFound": "{{icon}} **No lyrics found**\nThere were no Genius lyrics found for track **{{query}}**."
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
        },
        "trackMoved": "{{icon}} **Moved track**\n{track}\n\nTrack has been moved from position **`{{fromPosition}}`** to position **`{{toPosition}}`**.",
        "trackPositionHigherThanQueueLength_one": "{{icon}} **Oops!**\nYou cannot move the track in position **`{{fromPosition}}`** to position **`{{toPosition}}`**. There is only **`1`** track in the queue.\n\nView tracks added to the queue with {{queueCommand}}.",
        "trackPositionHigherThanQueueLength": "{{icon}} **Oops!**\nYou cannot move the track in position **`{{fromPosition}}`** to position **`{{toPosition}}`**. There are only **`{{count}}`** tracks in the queue.\n\nView tracks added to the queue with {{queueCommand}}."
      },
      "nowplaying": {
        "metadata": {
          "name": "nowplaying",
          "description": "Show information about the current track."
        },
        "embedFields": {
          "author": "**Artist**",
          "plays": "**Plays**",
          "source": "**Track source**"
        },
        "otherTracksInQueue_one": "1 other track in the queue...",
        "otherTracksInQueue": "{{count}} other tracks in the queue...",
        "playCount_zero": "Unknown",
        "playCount": "{{count, number}}"
      },
      "pause": {
        "metadata": {
          "name": "pause",
          "description": "Toggle pause for the current track."
        },
        "pauseConfirmation": "{{icon}} **Paused track**",
        "resumeConfirmation": "{{icon}} **Resumed track**",
        "directSource": "Direct source"
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
        },
        "addedToQueueTitle": "{{icon}} **Added to queue**",
        "playlistAddedTitle": "{{icon}} **Added playlist to queue**",
        "playlistAddedTrackCount_one": "And **1** more track... Use {{queueCommand}} to view all.",
        "playlistAddedTrackCount": "And **{{count}}** more tracks... Use {{queueCommand}} to view all.",
        "playlistTooLarge": "{{icon}} **Playlist too large**\nThis playlist is too large to be added to the queue.\n\nThe maximum amount of tracks that can be added to the queue is **{{count}}**.",
        "trackNotFound": "{{icon}} **No track found\nNo results found for **{{query}}**.\n\nIf you specified a URL, please make sure it is valid and public."
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
        },
        "tracksInQueueTitle": "{{icon}} **Tracks in queue**"
      },
      "reload": {
        "metadata": {
          "name": "reload",
          "description": "Reload slash command, autocomplete and component interactions across shards."
        },
        "reloadedCommands": "{{icon}} **Reloaded commands**",
        "unableToReload": "{{icon}} **Oops!**\n_Hmm..._ It seems I am unable to reload the interaction module across shards."
      },
      "remove": {
        "noTracksRemoved": "{{icon}} **No tracks removed**\nThere were no tracks removed from the queue. Please check if the option you selected has tracks to remove.",
        "removedTrack": "{{icon}} **Removed track**",
        "removedTracks": "{{icon}} **Removed tracks**\n**`{{count}}`** tracks were removed from the queue.",
        "startPositionHigherThanEndPosition": "{{icon}} **Oops!**\nStart position **`{{start}}`** is higher than end position **`{{end}}`**. Please specify a valid range.\n\nView tracks added to the queue with {{queueCommand}}.",
        "trackPositionHigherThanQueueLength_one": "{{icon}} **Oops!**\nPosition **`{{position}}`** is not a valid track position. There is only a total of **`1`** track in the queue.\n\nView the tracks added to the queue with {{queueCommand}}.",
        "trackPositionHigherThanQueueLength": "{{icon}} **Oops!**\nPosition **`{{position}}`** is not a valid track position. There are only a total of **`{{count}}`** tracks in the queue.\n\nView the tracks added to the queue with {{queueCommand}}."
      },
      "seek": {
        "metadata": {
          "name": "seek",
          "description": "Seek to a position in the current track.",
          "options": {
            "duration": {
              "name": "duration",
              "description": "Timestamp in format 00:00:00 (HH:mm:ss)."
            }
          }
        },
        "correctFormatInstruction": "{{icon}} **Oops!**\nYou entered an invalid duration format, **`{{wrongDuration}}`**.\nPlease use the format **`HH:mm:ss`**, **`mm:ss`** or **`ss`**.\n\n**Examples:**\n- **`/seek`** **`1:24:12`** - Seek to 1 hour, 24 minutes and 12 seconds.\n- **`/seek`** **`3:27`** - Seek to 3 minutes and 27 seconds.\n- **`/seek`** **`42`** - Seek to 42 seconds.",
        "durationLongerThanTrackDuration": "{{icon}} **Oops!**\nYou entered **`{{wrongDuration}}`**, which is a timestamp longer than the duration of the current track.\n\nPlease try a timestamp that is less than the duration of the track (**{{trackDuration}}**).",
        "seekingToTimestamp": "{{icon}} **Seeking to timestamp**\nSeeking to **`{{duration}}`** in current track."
      },
      "shards": {
        "metadata": {
          "name": "shards",
          "description": "Show information about all connected shards.",
          "options": {
            "sort": {
              "name": "sort",
              "description": "What to sort the shards by.",
              "choices": {
                "none": "None (Shard ID)",
                "memory": "Memory usage",
                "connections": "Voice Connections",
                "tracks": "Tracks",
                "listeners": "Listeners",
                "guilds": "Guilds",
                "members": "Members"
              }
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
        },
        "shuffledTracks": "{{icon}} **Shuffled queue tracks**\nThe **{{count}}** tracks in the queue have been shuffled.\n\nView the new queue order with {{queueCommand}}."
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
        },
        "emptyQueue": "{{icon}} **Oops!**\nThe queue is empty, add some tracks with {{playCommand}}!",
        "skippedTrack": "{{icon}} **Skipped track**",
        "trackPositionHigherThanQueueLength_one": "{{icon}} **Oops!**\nThere is only **1** track in the queue. You cannot skip to track **{{position}}**.\n\nView tracks added to the queue with {{queueCommand}}.",
        "trackPositionHigherThanQueueLength": "{{icon}} **Oops!**\nThere are only **{{count}}** tracks in the queue. You cannot skip to track **{{position}}**.\n\nView tracks added to the queue with {{queueCommand}}."
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
        },
        "stoppedPlaying": "{{icon}} **Stopped playing**\nStopped playing the audio and cleared the track queue.\n\nTo play more music, use the {{playCommand}} command!"
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
        },
        "invalidVolumeRange": "{{icon}} **Oops!**\nYou cannot set the volume to **`{{wrongVolume}}%`**, please pick a value between **`1%`** and **`100%`**.",
        "volumeChanged": "{{icon}} **Volume changed**\nPlayback volume has been changed to **`{{volume}}%`**.",
        "volumeInformation": "{{icon}} **Playback volume**\nThe playback volume is currently set to **`{{volume}}`**.",
        "volumeMuted": "{{icon}} **Audio muted**\nPlayback audio has been muted, because the volume was set to **`0%`**."
      }
    },
    "musicPlayerCommon": {
      "controls": {
        "stop": "Stop",
        "previous": "Previous",
        "pause": "Pause",
        "resume": "Resume",
        "skip": "Skip"
      },
      "footerPageNumber_one": "Page {{page}} of {{pageCount}} (1 track)",
      "footerPageNumber": "Page {{page}} of {{pageCount}} ({{count}} tracks)",
      "loopingInfo": "{{icon}} **Looping**\nLoop mode is set to **`{{loopMode}}`**. You can change it with {{loopCommand}}.",
      "nowPausedTitle": "{{icon}} **Currently paused**",
      "nowPlayingTitle": "{{icon}} **Now playing**",
      "playingLive": "{{icon}} **`LIVE`** - Playing continuously from live source.",
      "queueRepeatMode": {
        "off": "Disabled",
        "track": "Track",
        "queue": "Queue",
        "autoplay": "Autoplay"
      },
      "requestedBy": "**Requested by:** {{user}}",
      "unavailableAuthor": "Unavailable",
      "unavailableDuration": "_No duration available._",
      "unavailableRequestedBy": "Unavailable",
      "unavailableTrackTitle": "Title unavailable",
      "unavailableTrackUrl": "**Unavailable**",
      "unavailableSource": "Unavailable",
      "voiceChannelInfo": "Channel: {{channel}} ({{bitrate}}kbps)"
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
    },
    "validation": {
      "cannotJoinVoiceOrTalk": "{{icon}} **Oops!**\nI do not have permission to play audio in the voice channel {{channel}}.\n\nPlease make sure I have the **`Connect`** and **`Speak`** permissions in this voice channel.",
      "cannotSendMessageInChannel": "{{icon}} **Oops!**\nI do not have permission to send message replies in the channel {{channel}}.\n\nPlease make sure I have the **`View Channel`** permission in this text channel.",
      "historyDoesNotExist": "{{icon}} **Oops!**\nThere are no tracks in the history and nothing currently playing. First add some tracks with {{playCommand}}!",
      "notInSameVoiceChannel": "{{icon}} **Not in same voice channel**\nYou need to be in the same voice channel as me to perform this action.\n\n**Voice channel:** {{channel}}",
      "notInVoiceChannel": "{{icon}} **Not in a voice channel**\nYou need to be in a voice channel to perform this action.",
      "notValidGuildId": "{{icon}} **Oops!**\nNo permission to perform this action.\n\nThe command {{command}} cannot be executed in this server.",
      "queueDoesNotExist": "{{icon}} **Oops!**\nThere are no tracks in the queue and nothing currently playing. First add some tracks with {{playCommand}}!",
      "queueIsEmpty": "{{icon}} **Oops!\nThere are no tracks added to the queue. First add some tracks with {{playCommand}}!",
      "queueNoCurrentTrack": "{{icon}} **Oops!**\nThere is nothing currently playing. First add some tracks with {{playCommand}}!"
    }
  }
}

export default Resources;