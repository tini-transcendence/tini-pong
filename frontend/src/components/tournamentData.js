// tournamentData.js

import AbstractComponent from "./AbstractComponent.js";
import FetchModule from "../utils/fetchmodule.js";
import {BACKEND_URL} from "../index.js";


export default class extends AbstractComponent {
    constructor() {
        super();
        this.setTitle("Tournament Data");
    }

    async getHtml() {
        return `

        <body>
        
        <div class="container">
            <div class="b">
            <!-- 토너먼트 데이터가 입력되는 곳 -->
            </div>
    
        </div>
        
        <div class="container">
        <div class="text-end" id="btn">
        <button type="button" class="btn btn-outline-dark" id="goBackButton">돌아가기</button>
        </div>
        <script src="tournamentData.js"></script>
        </div>
        
        </body>
		`;
    }

    populateFunction(data) {
        console.log(typeof(data));

        var tbody = document.querySelector('.b');

        data.tournamentLog.forEach(function(tournamentData) {
            var ul = document.createElement('ul');
            ul.classList.add('tdataBox', 'list-group', 'd-flex', 'justify-content-between');

            var div = document.createElement('div');
            div.classList.add('row');
            
            var col3 = document.createElement('div');
            col3.classList.add('col-3');
            
            var timestampDiv = document.createElement('div');
            timestampDiv.classList.add('align-items-center', 'timestemp', 'noto-sans');
            var timestamp = new Date(tournamentData.tournament[0].timestamp * 1000);
            var timestampOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            var timestampString = new Intl.DateTimeFormat('en-US', timestampOptions).format(timestamp);
            timestampString = timestampString.replace(',', '<br>');
            timestampDiv.innerHTML = timestampString;
            col3.appendChild(timestampDiv);

            div.appendChild(col3);
            
            var col9 = document.createElement('div');
            col9.classList.add('col-9');
            
            
            tournamentData.tournament.forEach(function(matchData) {
                
                if (matchData.hasOwnProperty('timestamp')) {
                } else {
                    var game = document.createElement('div');
                    game.classList.add('game', 'justify-content-between', 'align-items-center', 'my-2', 'row');

                    var rankSpan = document.createElement('span');
                    rankSpan.classList.add('col-3', 'textAlign', 'game-rank');
                    rankSpan.textContent = matchData.index === 1 ? '1st' : matchData.index === 2 ? '2nd' : matchData.index === 3 ? 'Final' : matchData.index + 'th';
                    
                    var playerASpan = document.createElement('span');
                    playerASpan.classList.add('col', 'textAlign', 'game-player');
                    playerASpan.textContent = matchData.playerA.name;
                    
                    var scoreSpan = document.createElement('span');
                    scoreSpan.classList.add('col-3', 'textAlign', 'game-score');
                    scoreSpan.textContent = matchData.playerA.score + ' : ' + matchData.playerB.score;
                    
                    var playerBSpan = document.createElement('span');
                    playerBSpan.classList.add('col', 'textAlign', 'game-opponent');
                    playerBSpan.textContent = matchData.playerB.name;
                    
                    game.appendChild(rankSpan);
                    game.appendChild(playerASpan);
                    game.appendChild(scoreSpan);
                    game.appendChild(playerBSpan);
                    col9.appendChild(game);
                }
                ul.appendChild(div);
            });
            div.appendChild(col9);
            tbody.appendChild(ul);
        });
    }

    goBack() {
        window.history.back();
    }

    handleRoute() {

        const queryString = location.search;

        (async function (callback) {
            try {
                const fetchModule = new FetchModule();
                const response = await fetchModule.request(new Request(`${BACKEND_URL}/dashboard/tournament/`, {
                    method: 'GET',
                    credentials: "include"
                }));
                if (response.ok) {
                    const data = await response.json();
                    callback(data);
                }
                else
                    throw new Error(response.statusText);
            } catch (error) {
                console.log(error.message);
            }
        })(this.populateFunction);

        const goBackBtn = document.querySelector("#goBackButton");
        goBackBtn.addEventListener("click", event => {
            this.goBack();
        });
    }
}
