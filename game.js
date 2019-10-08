(function() {
    $(function(){
        var username = getUsername();
        var wordPool = getDictionary();
        var maxLifebarWidth = 30;
        var maxLifeTime = 10;

        if (!wordPool) {
            wordPool = ['Program', 'Console', 'JavaScript', 'Red', 'Blue', 'Green', 'Mouse', 'Pluto', 'Jupiter', 'Mars', 'Arrow'];
        }
        
        var $wordList = $('.wordGroup');
        var wordDtos = [];// Data transfer objects.
        var gameTimer = {
            time: 0 // In seconds
        };

        
        $('#userWord').keyup(onUserWordKeyup);

        if (username){
            init();
        }
        else {
            // Redirect to index.php
            window.location.replace('/TypingGame');
        }

        function init(){
            $('.game').css('display', 'block');
            $wordList.each(function (idx, element){
                wordDtos[idx] = word(idx, element);
            });

            gameTimer.intervalId = setInterval(function (){
                gameTimer.time++;
                $('#gameTimer').html(gameTimer.time);
            }, 1000);

            var test = $('#userWord')
            test[0].focus();
        }

        /**
         * Handler for keyup events. Checks displayed words and highlights correct portions of words.
         * @param {event} $evt The event data.
         */
        function onUserWordKeyup($evt){
            var userInput = $(this).val();
            
            // get array of words that start with the user input.
            var wordsToHighlight = wordDtos.filter(function (dto){
                return dto.word.toLowerCase().startsWith(userInput.toLowerCase());
            });

            // Reset word list highlighting.
            $wordList.each(function(idx,value){
                $(value).html($(value).data('word'));
            });

            if (wordsToHighlight.length === 0){
                //Reset user input because there are no words that match user input. Reset words.
                $('#userWord').val('');
            }
            else {
                // Highlight matching words.
                wordsToHighlight.forEach(function (dto){
                    var wordHtml = highlightWord(dto.word, userInput);
                    $(dto.$wordGroupElement).find('.word').html(wordHtml);

                    if (dto.word.length === userInput.length){
                        // Initialize new random word.
                        clearInterval(dto.intervalId);

                        wordDtos[dto.idx] = word(dto.idx, dto.$wordGroupElement);
                        $('#userWord').val('');
                    }
                });
            }
        }

        /**
         * Creates a new word dto.
         * @param {Number} wordGroupIdx The word group elements index.
         * @param {$element} $wordGroupElement The word group element.
         */
        function word(wordGroupIdx, $wordGroupElement){
            var newWordObj = {
                idx: wordGroupIdx,
                $wordGroupElement: $wordGroupElement,
                word: getRandomWord(),
                lifeTime: maxLifeTime, // in seconds
                lifebarWidth: maxLifebarWidth
            };

            var $timer = $($wordGroupElement).find('.timer');
            $timer.html(newWordObj.lifeTime);

            var $lifebar = $($wordGroupElement).find('.lifebar');
            $lifebar.css('height', 10);
            $lifebar.css('width', maxLifebarWidth);
            $lifebar.css('background-color', '#33aa33');

            var $word = $($wordGroupElement).find('.word');
            $word.html(newWordObj.word);

            newWordObj.intervalId = setInterval(function (){
                if (newWordObj.lifeTime > 0){
                    newWordObj.lifeTime--;
                    $timer.html(newWordObj.lifeTime);

                    newWordObj.lifebarWidth = (newWordObj.lifeTime / maxLifeTime) * maxLifebarWidth
                    var color = '#33aa33'
                    if (newWordObj.lifeTime <= .5 * maxLifeTime){
                        color = '#aa9933';
                    }
                    
                    if (newWordObj.lifeTime <= .25 * maxLifeTime){
                        color = '#aa3333';
                    }

                    $lifebar.animate({
                        width: newWordObj.lifebarWidth
                    });

                    $lifebar.css('background-color', color);
                }
                else {
                    clearInterval(newWordObj.intervalId);
                    alert(newWordObj.word + ' died! Game over!');

                    // window.location.href = 'highScore.php';

                    $.ajax({
                        type: "POST",
                        url: 'new_high_score.php', 
                        data: { username: username, score: gameTimer.time },
                        dataType: "json",
                        // On success.
                        success: function (result){
                                console.log('score saved');
    
                                window.location.href = 'highScore.php';
                        },
                        error: function (error){
                            console.log(error);
                            console.log('fail')
                        }
                    });

                    wordDtos.forEach(function (dto){
                        if (dto.intervalId != newWordObj.intervalId){
                            clearInterval(dto.intervalId);
                        }
                    });
                    clearInterval(gameTimer.intervalId);
                }
            }, 1000);

            return newWordObj;
        }

        /**
         * Gets a random word that does not already exist in wordDtos.
         */
        function getRandomWord(){
            var randomIdx = Math.floor(Math.random() * wordPool.length);
            var randomWord = wordPool[randomIdx];
            
            // If there are any words in wordDtos that are the same as randomWord, return a recursive call to getRandomWord.
            if (wordDtos.some(function (dto){
                return dto.word === randomWord;
            })){
                return getRandomWord();
            }
            else {
                return randomWord;
            }
        }

        /**
         * Wraps the correct part of a word with HTML to highlight it.
         * @param {string} word - The target word.
         * @param {string} userWord - The user input.
         */
        function highlightWord(word, userWord){
            return '<strong>' + word.slice(0, userWord.length) + '</strong>' + word.slice(userWord.length);
        }
    });
})();   