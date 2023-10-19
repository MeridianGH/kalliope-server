import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { WebsocketContext } from '../WebSocket/websocket.js'
import { Routes } from 'discord-api-types/v10'
import './dashboard.css'
import { Sidebar } from './components/Sidebar/sidebar.js'
import { NowPlaying } from './components/NowPlaying/nowplaying.js'
import { Queue } from './components/Queue/queue.js'
import { MediaSession } from './components/MediaSession/mediasession.js'
import { Start } from './components/Start/start.js'
import { Background } from '../Background/background.js'
import { Servers } from './components/Servers/servers.js'
import { Loader } from '../Loader/loader.js'

const playerObject = {
  'guildId': '610498937874546699',
  'voiceChannelId': '658690208295944232',
  'textChannelId': '658690163290931220',
  'paused': false,
  'volume': 50,
  'position': 400,
  'repeatMode': 'off',
  'queue': {
    'tracks': [
      {
        'encoded': 'QAAAxwMALERhdmlkIEd1ZXR0YSAmIEJlYmUgUmV4aGEgLSBCbHVlIChBSEggUmVtaXgpAANBSEgAAAAAAALqGAALWnRkM1U5NkNBTTAAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1adGQzVTk2Q0FNMAEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC9adGQzVTk2Q0FNMC9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'Ztd3U96CAM0',
          'title': 'David Guetta & Bebe Rexha - Blue (AHH Remix)',
          'author': 'AHH',
          'duration': 191000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/Ztd3U96CAM0/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=Ztd3U96CAM0',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAwAMAIVlvdSBTcGluIE1lIFJvdW5kIChMaWtlIEEgUmVjb3JkKQAHU3RhbmR5IAAAAAAAArNoAAtGTWJ3Qm5FY2JPWQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUZNYndCbkVjYk9ZAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL0ZNYndCbkVjYk9ZL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'FMbwBnEcbOY',
          'title': 'You Spin Me Round (Like A Record)',
          'author': 'Standy ',
          'duration': 177000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/FMbwBnEcbOY/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=FMbwBnEcbOY',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA4AMAO0xpbmtpbiBQYXJrIC0gSW4gVGhlIEVuZCAoTWVsbGVuIEdpICYgVG9tbWVlIFByb2ZpdHQgUmVtaXgpAA1UcmFwTXVzaWNIRFRWAAAAAAADV3gAC1dOZUxVbmdiLVhnAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9V05lTFVuZ2ItWGcBADpodHRwczovL2kueXRpbWcuY29tL3ZpX3dlYnAvV05lTFVuZ2ItWGcvbWF4cmVzZGVmYXVsdC53ZWJwAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'WNeLUngb-Xg',
          'title': 'Linkin Park - In The End (Mellen Gi & Tommee Profitt Remix)',
          'author': 'TrapMusicHDTV',
          'duration': 219000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/WNeLUngb-Xg/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=WNeLUngb-Xg',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAwwMAMFIzSEFCIHggTWlrZSBXaWxsaWFtcyAtIEx1bGxhYnkgKE9mZmljaWFsIFZpZGVvKQAFUjNIQUIAAAAAAAKEiAALOWZsWHl6Y1NmVDQAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj05ZmxYeXpjU2ZUNAEAMGh0dHBzOi8vaS55dGltZy5jb20vdmkvOWZsWHl6Y1NmVDQvbXFkZWZhdWx0LmpwZwAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': '9flXyzcSfT4',
          'title': 'R3HAB x Mike Williams - Lullaby (Official Video)',
          'author': 'R3HAB',
          'duration': 165000,
          'artworkUrl': 'https://i.ytimg.com/vi/9flXyzcSfT4/mqdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=9flXyzcSfT4',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA0gMANkl0YWxvQnJvdGhlcnMgLSBNeSBMaWZlIElzIEEgUGFydHkgKE9mZmljaWFsIFZpZGVvIEhEKQAKWm9vbGFuZC5UVgAAAAAAAzg4AAtzb2s4a3BfRFNxRQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PXNvazhrcF9EU3FFAQA0aHR0cHM6Ly9pLnl0aW1nLmNvbS92aS9zb2s4a3BfRFNxRS9tYXhyZXNkZWZhdWx0LmpwZwAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'sok8kp_DSqE',
          'title': 'ItaloBrothers - My Life Is A Party (Official Video HD)',
          'author': 'Zooland.TV',
          'duration': 211000,
          'artworkUrl': 'https://i.ytimg.com/vi/sok8kp_DSqE/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=sok8kp_DSqE',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA5wMAP01pa2UgV2lsbGlhbXMgeCBNZXN0byAtIFdhaXQgQW5vdGhlciBEYXkgKE9mZmljaWFsIE11c2ljIFZpZGVvKQAQU3Bpbm5pbicgUmVjb3JkcwAAAAAAAtaQAAtuMThnNGJSSkRDWQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PW4xOGc0YlJKRENZAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL24xOGc0YlJKRENZL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'n18g4bRJDCY',
          'title': 'Mike Williams x Mesto - Wait Another Day (Official Music Video)',
          'author': 'Spinnin\' Records',
          'duration': 186000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/n18g4bRJDCY/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=n18g4bRJDCY',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA8QMAUEpheCBKb25lcywgTWFydGluIFNvbHZlaWcsIE1hZGlzb24gQmVlciAtIEFsbCBEYXkgQW5kIE5pZ2h0IChMYXRlIE5pZ2h0IFNlc3Npb24pAAlKYXggSm9uZXMAAAAAAAKYEAALamZyZUZQZTk5R1UAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1qZnJlRlBlOTlHVQEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC9qZnJlRlBlOTlHVS9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'jfreFPe99GU',
          'title': 'Jax Jones, Martin Solveig, Madison Beer - All Day And Night (Late Night Session)',
          'author': 'Jax Jones',
          'duration': 170000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/jfreFPe99GU/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=jfreFPe99GU',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzQMAKEdhYnJ5IFBvbnRlIHggTFVNIVggeCBQcmV6aW9zbyAtIFRodW5kZXIADUJvdW5jZSBVbml0ZWQAAAAAAAJpMAALMXJvSEpkRExkUUUAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj0xcm9ISmRETGRRRQEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC8xcm9ISmRETGRRRS9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': '1roHJdDLdQE',
          'title': 'Gabry Ponte x LUM!X x Prezioso - Thunder',
          'author': 'Bounce United',
          'duration': 158000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/1roHJdDLdQE/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=1roHJdDLdQE',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA3gMANkFsb2sgLSBMb3ZlIEFnYWluIChmZWF0LiBBbGlkYSkgW09mZmljaWFsIEx5cmljIFZpZGVvXQAQU3Bpbm5pbicgUmVjb3JkcwAAAAAAAlmQAAtiaFVfREVNLTdZYwABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWJoVV9ERU0tN1ljAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL2JoVV9ERU0tN1ljL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'bhU_DEM-7Yc',
          'title': 'Alok - Love Again (feat. Alida) [Official Lyric Video]',
          'author': 'Spinnin\' Records',
          'duration': 154000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/bhU_DEM-7Yc/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=bhU_DEM-7Yc',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAyQMAJUFUTGllbnMgLSBUYW50cmEgKE9uZSBUcnVlIEdvZCBSZW1peCkADE9uZSBUcnVlIEdvZAAAAAAAAquYAAtHRmZNTFE1REtKMAABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUdGZk1MUTVES0owAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL0dGZk1MUTVES0owL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'GFfMLQ5DKJ0',
          'title': 'ATLiens - Tantra (One True God Remix)',
          'author': 'One True God',
          'duration': 175000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/GFfMLQ5DKJ0/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=GFfMLQ5DKJ0',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAABPAMANkl0YWxvQnJvdGhlcnMgLSBTdGFtcCBPbiBUaGUgR3JvdW5kIChET1BFRFJPUCBCb290bGVnKQANQm91bmNlIFVuaXRlZAAAAAAAA8yoAAtkUXYzX1AyREp2ZwABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWRRdjNfUDJESnZnAQCbaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS9kUXYzX1AyREp2Zy9tYXhyZXNkZWZhdWx0LmpwZz9zcXA9LW9heW13RW1DSUFLRU5BRjhxdUtxUU1hOEFFQi1BSC1DWUFDMEFXS0Fnd0lBQkFCR0ZzZ0V5aF9NQTg9JnJzPUFPbjRDTEJmSHR3RUR4OENaa1pEVFczcmZJRHMxLUhDRHcAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'dQv3_P2DJvg',
          'title': 'ItaloBrothers - Stamp On The Ground (DOPEDROP Bootleg)',
          'author': 'Bounce United',
          'duration': 249000,
          'artworkUrl': 'https://i.ytimg.com/vi/dQv3_P2DJvg/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFsgEyh_MA8=&rs=AOn4CLBfHtwEDx8CZkZDTW3rfIDs1-HCDw',
          'uri': 'https://www.youtube.com/watch?v=dQv3_P2DJvg',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzwMAJ1R1bmdldmFhZyAtIFBlcnUgKE9mZmljaWFsIEx5cmljIFZpZGVvKQAQU3Bpbm5pbicgUmVjb3JkcwAAAAAAAlmQAAs0MC1tb3ZRSjg5MAABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTQwLW1vdlFKODkwAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwLzQwLW1vdlFKODkwL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': '40-movQJ890',
          'title': 'Tungevaag - Peru (Official Lyric Video)',
          'author': 'Spinnin\' Records',
          'duration': 154000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/40-movQJ890/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=40-movQJ890',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAwAMAHE9uZSBUcnVlIEdvZCAtIE1vcnRhbCBLb21iYXQADE9uZSBUcnVlIEdvZAAAAAAAAu4AAAtLZFV1V3dpR3lwWQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUtkVXVXd2lHeXBZAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL0tkVXVXd2lHeXBZL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'KdUuWwiGypY',
          'title': 'One True God - Mortal Kombat',
          'author': 'One True God',
          'duration': 192000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/KdUuWwiGypY/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=KdUuWwiGypY',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzwMAKkNhcmF2YW4gUGFsYWNlIC0gTG9uZSBEaWdnZXIgKE9mZmljaWFsIE1WKQANQ2FyYXZhblBhbGFjZQAAAAAAApv4AAtVYlFnWGVZX3ppNAABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVViUWdYZVlfemk0AQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL1ViUWdYZVlfemk0L21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'UbQgXeY_zi4',
          'title': 'Caravan Palace - Lone Digger (Official MV)',
          'author': 'CaravanPalace',
          'duration': 171000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/UbQgXeY_zi4/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=UbQgXeY_zi4',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA2AMANE9uZSBUcnVlIEdvZCAmIERyYWljb2ggLSBIdXNoIChPZmZpY2lhbCBMeXJpYyBWaWRlbykADE9uZSBUcnVlIEdvZAAAAAAAAp/gAAtRLTB0RjlUMmhNOAABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVEtMHRGOVQyaE04AQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL1EtMHRGOVQyaE04L21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'Q-0tF9T2hM8',
          'title': 'One True God & Draicoh - Hush (Official Lyric Video)',
          'author': 'One True God',
          'duration': 172000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/Q-0tF9T2hM8/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=Q-0tF9T2hM8',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAygMAL0xpcXVpZG8gLSBOYXJjb3RpYyAoSEJ6ICYgQWR3ZWdubyBCb3VuY2UgUmVtaXgpAANIQnoAAAAAAAQyOAALX2N2ekNObHhfWTgAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1fY3Z6Q05seF9ZOAEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC9fY3Z6Q05seF9ZOC9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': '_cvzCNlx_Y8',
          'title': 'Liquido - Narcotic (HBz & Adwegno Bounce Remix)',
          'author': 'HBz',
          'duration': 275000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/_cvzCNlx_Y8/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=_cvzCNlx_Y8',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAtgMAF0IzbnRlICYgQjNWQSAtIExhIExhIExhAA1Cb3VuY2UgVW5pdGVkAAAAAAACE0AAC3NadksyZVZQZVE4AAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9c1p2SzJlVlBlUTgBADRodHRwczovL2kueXRpbWcuY29tL3ZpL3NadksyZVZQZVE4L21heHJlc2RlZmF1bHQuanBnAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'sZvK2eVPeQ8',
          'title': 'B3nte & B3VA - La La La',
          'author': 'Bounce United',
          'duration': 136000,
          'artworkUrl': 'https://i.ytimg.com/vi/sZvK2eVPeQ8/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=sZvK2eVPeQ8',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzgMAJ1RpbW15IFRydW1wZXQgJiBHYWJyeSBQb250ZSAtIE1hZCBXb3JsZAAPV29ybGQgb2YgQm91bmNlAAAAAAACWZAAC0RFN0hCbW5zajVJAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9REU3SEJtbnNqNUkBADpodHRwczovL2kueXRpbWcuY29tL3ZpX3dlYnAvREU3SEJtbnNqNUkvbWF4cmVzZGVmYXVsdC53ZWJwAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'DE7HBmnsj5I',
          'title': 'Timmy Trumpet & Gabry Ponte - Mad World',
          'author': 'World of Bounce',
          'duration': 154000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/DE7HBmnsj5I/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=DE7HBmnsj5I',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA+AMAR1RoZSBTY3JpcHQgLSBIYWxsIE9mIEZhbWUgKERhcmsgUmVoYWIgSGFyZHN0eWxlIEJvb3RsZWcpIHwgSFEgVmlkZW9jbGlwABlIYXJkc3R5bGVVcDJEYXRleiBbSFUyRHpdAAAAAAAEJoAAC1liczJBU1R3SEx3AAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9WWJzMkFTVHdITHcBADpodHRwczovL2kueXRpbWcuY29tL3ZpX3dlYnAvWWJzMkFTVHdITHcvbWF4cmVzZGVmYXVsdC53ZWJwAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'Ybs2ASTwHLw',
          'title': 'The Script - Hall Of Fame (Dark Rehab Hardstyle Bootleg) | HQ Videoclip',
          'author': 'HardstyleUp2Datez [HU2Dz]',
          'duration': 272000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/Ybs2ASTwHLw/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=Ybs2ASTwHLw',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA2gMANUl0YWxvYnJvdGhlcnMgLSBNeSBMaWZlIElzIEEgUGFydHkgKERPUEVEUk9QIEJvb3RsZWcpAA1Cb3VuY2UgVW5pdGVkAAAAAAAD5BgAC2J3bnpFOXgzeVZZAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9YnduekU5eDN5VlkBADpodHRwczovL2kueXRpbWcuY29tL3ZpX3dlYnAvYnduekU5eDN5VlkvbWF4cmVzZGVmYXVsdC53ZWJwAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'bwnzE9x3yVY',
          'title': 'Italobrothers - My Life Is A Party (DOPEDROP Bootleg)',
          'author': 'Bounce United',
          'duration': 255000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/bwnzE9x3yVY/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=bwnzE9x3yVY',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzAMAJ0ZsbyBSaWRhIC0gTXkgSG91c2UgKEphY2sgRHllciBCb290bGVnKQANQm91bmNlIFVuaXRlZAAAAAAAA4ZYAAtXRXJMZkRiRHpmOAABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVdFckxmRGJEemY4AQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL1dFckxmRGJEemY4L21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'WErLfDbDzf8',
          'title': 'Flo Rida - My House (Jack Dyer Bootleg)',
          'author': 'Bounce United',
          'duration': 231000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/WErLfDbDzf8/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=WErLfDbDzf8',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAyQMALkZsbyBSaWRhIC0gUmlnaHQgUm91bmQgKEhCeiBIYXJkLUJvdW5jZSBSZW1peCkAA0hCegAAAAAAA27oAAswLTV4cmNISG4zdwABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PTAtNXhyY0hIbjN3AQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwLzAtNXhyY0hIbjN3L21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': '0-5xrcHHn3w',
          'title': 'Flo Rida - Right Round (HBz Hard-Bounce Remix)',
          'author': 'HBz',
          'duration': 225000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/0-5xrcHHn3w/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=0-5xrcHHn3w',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA6AMAN1RhY2Ficm8gLSBUYWNhdGEgKFRDTSBIYXJkc3R5bGUgQm9vdGxlZykgfCBIUSBWaWRlb2NsaXAAGUhhcmRzdHlsZVVwMkRhdGV6IFtIVTJEel0AAAAAAAL9oAALbEhrRFVTdjVGOXMAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1sSGtEVVN2NUY5cwEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC9sSGtEVVN2NUY5cy9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'lHkDUSv5F9s',
          'title': 'Tacabro - Tacata (TCM Hardstyle Bootleg) | HQ Videoclip',
          'author': 'HardstyleUp2Datez [HU2Dz]',
          'duration': 196000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/lHkDUSv5F9s/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=lHkDUSv5F9s',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzQMAMlRoZUZhdFJhdCAmIFJJRUxMIC0gSGlkaW5nIEluIFRoZSBCbHVlIFtDaGFwdGVyIDFdAAlUaGVGYXRSYXQAAAAAAANfSAALYVF6VWFaR0RKODAAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1hUXpVYVpHREo4MAEANGh0dHBzOi8vaS55dGltZy5jb20vdmkvYVF6VWFaR0RKODAvbWF4cmVzZGVmYXVsdC5qcGcAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'aQzUaZGDJ80',
          'title': 'TheFatRat & RIELL - Hiding In The Blue [Chapter 1]',
          'author': 'TheFatRat',
          'duration': 221000,
          'artworkUrl': 'https://i.ytimg.com/vi/aQzUaZGDJ80/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=aQzUaZGDJ80',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAugMAH1RoZUZhdFJhdCAtIEFyY2FkaWEgW0NoYXB0ZXIgMl0ACVRoZUZhdFJhdAAAAAAAAt5gAAtFYjVxc1dQRExQdwABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PUViNXFzV1BETFB3AQA0aHR0cHM6Ly9pLnl0aW1nLmNvbS92aS9FYjVxc1dQRExQdy9tYXhyZXNkZWZhdWx0LmpwZwAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'Eb5qsWPDLPw',
          'title': 'TheFatRat - Arcadia [Chapter 2]',
          'author': 'TheFatRat',
          'duration': 188000,
          'artworkUrl': 'https://i.ytimg.com/vi/Eb5qsWPDLPw/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=Eb5qsWPDLPw',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAxwMALFRoZUZhdFJhdCAmIFJJRUxMIC0gUHJpZGUgJiBGZWFyIFtDaGFwdGVyIDNdAAlUaGVGYXRSYXQAAAAAAAKMWAALcEpHVW45d19sX1EAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1wSkdVbjl3X2xfUQEANGh0dHBzOi8vaS55dGltZy5jb20vdmkvcEpHVW45d19sX1EvbWF4cmVzZGVmYXVsdC5qcGcAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'pJGUn9w_l_Q',
          'title': 'TheFatRat & RIELL - Pride & Fear [Chapter 3]',
          'author': 'TheFatRat',
          'duration': 167000,
          'artworkUrl': 'https://i.ytimg.com/vi/pJGUn9w_l_Q/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=pJGUn9w_l_Q',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAxQMAKlRoZUZhdFJhdCAmIExhdXJhIEJyZWhtIC0gV2UnbGwgTWVldCBBZ2FpbgAJVGhlRmF0UmF0AAAAAAAC/aAAC2hKcVljNjJOQ0tvAAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9aEpxWWM2Mk5DS28BADRodHRwczovL2kueXRpbWcuY29tL3ZpL2hKcVljNjJOQ0tvL21heHJlc2RlZmF1bHQuanBnAAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': 'hJqYc62NCKo',
          'title': 'TheFatRat & Laura Brehm - We\'ll Meet Again',
          'author': 'TheFatRat',
          'duration': 196000,
          'artworkUrl': 'https://i.ytimg.com/vi/hJqYc62NCKo/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=hJqYc62NCKo',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAA0wMAL01FTE9OIC0gQmx1ZSAoRGEgQmEgRGVlKSBbRGFuY2UgRnJ1aXRzIFJlbGVhc2VdAAxEYW5jZSBGcnVpdHMAAAAAAAJGCAALS3JnYng0U1luVmcAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1LcmdieDRTWW5WZwEAOmh0dHBzOi8vaS55dGltZy5jb20vdmlfd2VicC9LcmdieDRTWW5WZy9tYXhyZXNkZWZhdWx0LndlYnAAAAd5b3V0dWJlAAAAAAAAAAA=',
        'info': {
          'identifier': 'Krgbx4SYnVg',
          'title': 'MELON - Blue (Da Ba Dee) [Dance Fruits Release]',
          'author': 'Dance Fruits',
          'duration': 149000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/Krgbx4SYnVg/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=Krgbx4SYnVg',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzAMAJFl2ZXMgViAtIEVjaG8gKE9mZmljaWFsIEx5cmljIFZpZGVvKQAQU3Bpbm5pbicgUmVjb3JkcwAAAAAAAtp4AAtiSEtSSVdab1gwWQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWJIS1JJV1pvWDBZAQA6aHR0cHM6Ly9pLnl0aW1nLmNvbS92aV93ZWJwL2JIS1JJV1pvWDBZL21heHJlc2RlZmF1bHQud2VicAAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'bHKRIWZoX0Y',
          'title': 'Yves V - Echo (Official Lyric Video)',
          'author': 'Spinnin\' Records',
          'duration': 187000,
          'artworkUrl': 'https://i.ytimg.com/vi_webp/bHKRIWZoX0Y/maxresdefault.webp',
          'uri': 'https://www.youtube.com/watch?v=bHKRIWZoX0Y',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAzAMANFBveWxvdyAtIEFpcnBsYW5lcyAoZnQuIEvDqWRvIFJlYmVsbGUgJiBJdmFuIEphbWlsZSkABlBveWxvdwAAAAAAAibIAAtUY0xhM3Yzc2FoRQABACtodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PVRjTGEzdjNzYWhFAQA0aHR0cHM6Ly9pLnl0aW1nLmNvbS92aS9UY0xhM3Yzc2FoRS9tYXhyZXNkZWZhdWx0LmpwZwAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'TcLa3v3sahE',
          'title': 'Poylow - Airplanes (ft. Kédo Rebelle & Ivan Jamile)',
          'author': 'Poylow',
          'duration': 141000,
          'artworkUrl': 'https://i.ytimg.com/vi/TcLa3v3sahE/maxresdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=TcLa3v3sahE',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAAAtAMAHEJlaG1lciAmIEJyb21hZ2UgLSBBcG9sb2dpemUACkFlcm8gTXVzaWMAAAAAAAIqsAALV2RJbVRPT1VEWUkAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1XZEltVE9PVURZSQEAMGh0dHBzOi8vaS55dGltZy5jb20vdmkvV2RJbVRPT1VEWUkvbXFkZWZhdWx0LmpwZwAAB3lvdXR1YmUAAAAAAAAAAA==',
        'info': {
          'identifier': 'WdImTOOUDYI',
          'title': 'Behmer & Bromage - Apologize',
          'author': 'Aero Music',
          'duration': 142000,
          'artworkUrl': 'https://i.ytimg.com/vi/WdImTOOUDYI/mqdefault.jpg',
          'uri': 'https://www.youtube.com/watch?v=WdImTOOUDYI',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      },
      {
        'encoded': 'QAABNwMAM0tpbGwgUGFyaXMgLSBPcGVyYXRlIChmZWF0LiBSb3lhbCkgKElsbGVuaXVtIFJlbWl4KQALVHJhcCBOYXRpb24AAAAAAAQPEAALMkRuT253MTh1NUUAAQAraHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj0yRG5PbncxOHU1RQEAm2h0dHBzOi8vaS55dGltZy5jb20vdmkvMkRuT253MTh1NUUvbWF4cmVzZGVmYXVsdC5qcGc/c3FwPS1vYXltd0VtQ0lBS0VOQUY4cXVLcVFNYThBRUItQUhVQm9BQzRBT0tBZ3dJQUJBQkdHVWdVU2hNTUE4PSZycz1BT240Q0xDdUdIdTBBcUk0Tlpzd1EzYldDQmtYdXJsLVZ3AAAHeW91dHViZQAAAAAAAAAA',
        'info': {
          'identifier': '2DnOnw18u5E',
          'title': 'Kill Paris - Operate (feat. Royal) (Illenium Remix)',
          'author': 'Trap Nation',
          'duration': 266000,
          'artworkUrl': 'https://i.ytimg.com/vi/2DnOnw18u5E/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGGUgUShMMA8=&rs=AOn4CLCuGHu0AqI4NZswQ3bWCBkXurl-Vw',
          'uri': 'https://www.youtube.com/watch?v=2DnOnw18u5E',
          'sourceName': 'youtube',
          'isSeekable': true,
          'isStream': false,
          'isrc': null
        },
        'pluginInfo': { 'clientData': {} },
        'requester': {
          'guildId': '610498937874546699',
          'joinedTimestamp': 1565624689459,
          'premiumSinceTimestamp': null,
          'nickname': null,
          'pending': false,
          'communicationDisabledUntilTimestamp': null,
          'userId': '360817252158930954',
          'avatar': null,
          'flags': 0,
          'displayName': 'Meridian',
          'roles': [
            '658684656950050817',
            '610498937874546699'
          ],
          'avatarURL': null,
          'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
        }
      }
    ],
    'current': {
      'encoded': 'QAAA1AMAMkZSIUVTICYgTElaT1QgLSBNaXNzaW5nIFlvdSAoT2ZmaWNpYWwgTXVzaWMgVmlkZW8pABBTcGlubmluJyBSZWNvcmRzAAAAAAACYWAAC3U5djM0NndpUkc0AAEAK2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9dTl2MzQ2d2lSRzQBADRodHRwczovL2kueXRpbWcuY29tL3ZpL3U5djM0NndpUkc0L21heHJlc2RlZmF1bHQuanBnAAAHeW91dHViZQAAAAAAAAAA',
      'info': {
        'identifier': 'u9v346wiRG4',
        'title': 'FR!ES & LIZOT - Missing You (Official Music Video)',
        'author': 'Spinnin\' Records',
        'duration': 156000,
        'artworkUrl': 'https://i.ytimg.com/vi/u9v346wiRG4/maxresdefault.jpg',
        'uri': 'https://www.youtube.com/watch?v=u9v346wiRG4',
        'sourceName': 'youtube',
        'isSeekable': true,
        'isStream': false,
        'isrc': null
      },
      'pluginInfo': { 'clientData': {} },
      'requester': {
        'guildId': '610498937874546699',
        'joinedTimestamp': 1565624689459,
        'premiumSinceTimestamp': null,
        'nickname': null,
        'pending': false,
        'communicationDisabledUntilTimestamp': null,
        'userId': '360817252158930954',
        'avatar': null,
        'flags': 0,
        'displayName': 'Meridian',
        'roles': [
          '658684656950050817',
          '610498937874546699'
        ],
        'avatarURL': null,
        'displayAvatarURL': 'https://cdn.discordapp.com/avatars/360817252158930954/5ca503af7e9f9b64c1eee2d4f947a29d.webp'
      }
    }
  },
  'filters': {
    'current': 'none',
    'timescale': 1
  }
}

export function Dashboard() {
  document.title = 'Kalliope | Dashboard'

  const websocket = useContext(WebsocketContext)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [player, setPlayer] = useState(null)
  const [clientGuilds, setClientGuilds] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [searchParams] = useSearchParams()

  // WebSocket Effect
  useEffect(() => {
    if (!websocket || !user) { return }
    websocket.sendData = (type = 'none', data = {}) => {
      data.type = data.type ?? type
      data.userId = data.userId ?? user.id
      data.guildId = data.guildId ?? player?.guildId ?? null
      try {
        websocket.send(JSON.stringify(data))
      } catch (error) {
        console.error(error)
      }
      console.log('sent:', data)
    }

    websocket.onclose = () => { console.warn('WebSocket closed.') }
    websocket.onmessage = (message) => {
      const data = JSON.parse(message?.data)
      console.log('received:', data)
      switch (data.type) {
        case 'clientGuilds': {
          setTimeout(() => {
            setClientGuilds(data.guilds)
          }, Math.floor(Math.random() * 2000 + 1000))
          break
        }
        case 'playerData': {
          setPlayer(data.player)
          break
        }
      }
    }
  }, [websocket, user, player, clientGuilds])
  // Login Effect
  useEffect(() => {
    if (user) {
      history.replaceState(null, '', location.href.split('?')[0])
      return
    }
    const loginUrl = `https://discordapp.com/api/oauth2/authorize?client_id=1053262351803093032&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}`

    const code = searchParams.get('code')
    if (!code) {
      setTimeout(() => {
        window.location.replace(loginUrl)
      }, 3000)
      return
    }

    async function fetchUser() {
      const body = new URLSearchParams({
        'client_id': '1053262351803093032',
        'client_secret': 'z3rbrd_dNS-sR6JJ3UvciefXljqwqv0o',
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': `${location.origin}/dashboard`
      })

      const token = await fetch('https://discord.com/api' + Routes.oauth2TokenExchange(), {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching token while authenticating: ' + e)
      })
      // noinspection JSUnresolvedVariable
      if (!token?.access_token) {
        window.location.replace(loginUrl)
        return
      }

      const discordUser = await fetch('https://discord.com/api' + Routes.user(), {
        method: 'GET',
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching user while authenticating: ' + e)
      })
      const guilds = await fetch('https://discord.com/api' + Routes.userGuilds(), {
        method: 'GET',
        headers: { authorization: `${token.token_type} ${token.access_token}` }
      }).then((response) => response.json()).catch((e) => {
        console.error('Error while fetching guilds while authenticating: ' + e)
      })
      if (!discordUser || !guilds) {
        window.location.replace(loginUrl)
        return
      }

      discordUser.guilds = guilds
      localStorage.setItem('user', JSON.stringify(discordUser))
      setUser(discordUser)
    }
    fetchUser().catch(() => { window.location.replace(loginUrl) })
  }, [searchParams, user])

  const tabs = [
    <Start key={0} setActiveTab={setActiveTab} player={!!player}/>,
    <Servers key={1} setActiveTab={setActiveTab} userId={user?.id} userGuilds={user?.guilds} clientGuilds={clientGuilds}/>,
    <NowPlaying key={2} player={player}/>,
    <Queue key={3} tracks={player?.queue?.tracks ?? []}/>
  ]

  return (
    <div className={'dashboard'}>
      <Background style={'transparent'}/>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} player={!!player}/>
      <div className={'sidebar-margin'}>
        {!user ? <div className={'flex-container'} style={{ height: '100%' }}><Loader/></div> : tabs[activeTab]}
        <button onClick={() => { setPlayer(playerObject); setActiveTab(2) }}>Server</button>
      </div>
      {player?.queue?.current ? <MediaSession track={player.queue.current} paused={player.paused}/> : null}
    </div>
  )
}
