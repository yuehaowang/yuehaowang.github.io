// Mythium Archive: https://archive.org/details/mythium/

function createPlayer($, tracks) {
    'use strict'
    var supportsAudio = !!document.createElement('audio').canPlayType;
    if (supportsAudio) {
        // initialize plyr
        var player = new Plyr('#audio1', {
            controls: [
                'restart',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'download'
            ]
        });
        // initialize playlist and controls
        function getQueryVariable(key) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == key) {
                    return decodeURIComponent(pair[1]);
                }
            }
            return -1;
        }

        var query_idx = parseInt(getQueryVariable('idx'));
        var index = query_idx < 0 ? 0 : query_idx,
            playing = false,
            mediaPath = '/downloads/music/',
            extension = '',
            buildPlaylist = $.each(tracks, function(key, value) {
                var trackNumber = value.track,
                    trackName = value.name,
                    trackDuration = value.duration;
                if (trackNumber.toString().length === 1) {
                    trackNumber = '0' + trackNumber;
                }
                $('#plList').append('<li> \
                    <div class="plItem"> \
                        <span class="plNum">' + trackNumber + '.</span> \
                        <span class="plTitle">' + trackName + '</span> \
                        <span class="plLength">' + trackDuration + '</span> \
                    </div> \
                </li>');
            }),
            trackCount = tracks.length,
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            audio = $('#audio1').on('play', function () {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function () {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function () {
                npAction.text('Paused...');
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0),
            btnPrev = $('#btnPrev').on('click', function () {
                if ((index - 1) > -1) {
                    index--;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            btnNext = $('#btnNext').on('click', function () {
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            li = $('#plList li').on('click', function () {
                var id = parseInt($(this).index());
                if (id !== index) {
                    playTrack(id);
                }
            }),
            loadTrack = function (id) {
                $('.plSel').removeClass('plSel');
                $('#plList li:eq(' + id + ')').addClass('plSel');
                npTitle.text(tracks[id].name);
                index = id;
                audio.src = mediaPath + tracks[id].file + extension;
                updateDownload(id, audio.src);
            },
            updateDownload = function (id, source) {
                player.on('loadedmetadata', function () {
                    $('a[data-plyr="download"]').attr('href', source);
                });
            },
            playTrack = function (id) {
                loadTrack(id);
                audio.play();
            };
        extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
        loadTrack(index);
    } else {
        // no audio support
        $('.column').addClass('hidden');
        var noSupport = $('#audio1').text();
        $('.container').append('<p class="no-support">' + noSupport + '</p>');
    }
}

// jQuery(function ($) {
//     'use strict'
//     var supportsAudio = !!document.createElement('audio').canPlayType;
//     if (supportsAudio) {
//         // initialize plyr
//         var player = new Plyr('#audio1', {
//             controls: [
//                 'restart',
//                 'play',
//                 'progress',
//                 'current-time',
//                 'duration',
//                 'mute',
//                 'volume',
//                 'download'
//             ]
//         });
//         // initialize playlist and controls
//         function getQueryVariable(key) {
//             var query = window.location.search.substring(1);
//             var vars = query.split('&');
//             for (var i = 0; i < vars.length; i++) {
//                 var pair = vars[i].split('=');
//                 if (decodeURIComponent(pair[0]) == key) {
//                     return decodeURIComponent(pair[1]);
//                 }
//             }
//             return -1;
//         }

//         var query_idx = parseInt(getQueryVariable('idx'));
//         var index = query_idx < 0 ? 0 : query_idx,
//             playing = false,
//             mediaPath = '/downloads/music/',
//             extension = '',
//             tracks = [{
//                 "track": 1,
//                 "name": "Band Mix",
//                 "duration": "1:26",
//                 "file": "Band_Mix"
//             }, {
//                 "track": 2,
//                 "name": "Yangtze River Park",
//                 "duration": "1:14",
//                 "file": "Yangtze_River_Park"
//             }, {
//                 "track": 3,
//                 "name": "Birthday Fireworks",
//                 "duration": "2:30",
//                 "file": "Birthday_Fireworks"
//             }, {
//                 "track": 4,
//                 "name": "Balcony",
//                 "duration": "1:38",
//                 "file": "Balcony"
//             }, {
//                 "track": 5,
//                 "name": "Travelling Apollo",
//                 "duration": "2:23",
//                 "file": "Travelling_Apollo"
//             }],
//             buildPlaylist = $.each(tracks, function(key, value) {
//                 var trackNumber = value.track,
//                     trackName = value.name,
//                     trackDuration = value.duration;
//                 if (trackNumber.toString().length === 1) {
//                     trackNumber = '0' + trackNumber;
//                 }
//                 $('#plList').append('<li> \
//                     <div class="plItem"> \
//                         <span class="plNum">' + trackNumber + '.</span> \
//                         <span class="plTitle">' + trackName + '</span> \
//                         <span class="plLength">' + trackDuration + '</span> \
//                     </div> \
//                 </li>');
//             }),
//             trackCount = tracks.length,
//             npAction = $('#npAction'),
//             npTitle = $('#npTitle'),
//             audio = $('#audio1').on('play', function () {
//                 playing = true;
//                 npAction.text('Now Playing...');
//             }).on('pause', function () {
//                 playing = false;
//                 npAction.text('Paused...');
//             }).on('ended', function () {
//                 npAction.text('Paused...');
//                 if ((index + 1) < trackCount) {
//                     index++;
//                     loadTrack(index);
//                     audio.play();
//                 } else {
//                     audio.pause();
//                     index = 0;
//                     loadTrack(index);
//                 }
//             }).get(0),
//             btnPrev = $('#btnPrev').on('click', function () {
//                 if ((index - 1) > -1) {
//                     index--;
//                     loadTrack(index);
//                     if (playing) {
//                         audio.play();
//                     }
//                 } else {
//                     audio.pause();
//                     index = 0;
//                     loadTrack(index);
//                 }
//             }),
//             btnNext = $('#btnNext').on('click', function () {
//                 if ((index + 1) < trackCount) {
//                     index++;
//                     loadTrack(index);
//                     if (playing) {
//                         audio.play();
//                     }
//                 } else {
//                     audio.pause();
//                     index = 0;
//                     loadTrack(index);
//                 }
//             }),
//             li = $('#plList li').on('click', function () {
//                 var id = parseInt($(this).index());
//                 if (id !== index) {
//                     playTrack(id);
//                 }
//             }),
//             loadTrack = function (id) {
//                 $('.plSel').removeClass('plSel');
//                 $('#plList li:eq(' + id + ')').addClass('plSel');
//                 npTitle.text(tracks[id].name);
//                 index = id;
//                 audio.src = mediaPath + tracks[id].file + extension;
//                 updateDownload(id, audio.src);
//             },
//             updateDownload = function (id, source) {
//                 player.on('loadedmetadata', function () {
//                     $('a[data-plyr="download"]').attr('href', source);
//                 });
//             },
//             playTrack = function (id) {
//                 loadTrack(id);
//                 audio.play();
//             };
//         extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
//         loadTrack(index);
//     } else {
//         // no audio support
//         $('.column').addClass('hidden');
//         var noSupport = $('#audio1').text();
//         $('.container').append('<p class="no-support">' + noSupport + '</p>');
//     }
// });