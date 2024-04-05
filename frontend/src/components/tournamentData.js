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
        <style>
        .b {
            /* border: solid 1px black; */
            max-width: 750px;
            overflow: auto;
            margin: 0 auto;
            margin-bottom: 30px;
        }
        
        .title {
            text-align: center;
            color: brown;
            margin-bottom: 10px;
        }
        </style>
        
        <body>
        
        <div class="container">
        <h1 class="display-7 title">Pong Tournament Data from Blockchain.</h1>
        <table class="table b">
        <thead>
        <tr>
        <th scope="col">Time Stemp</th>
        <th scope="col">Game 1</th>
        <th scope="col">Game 2</th>
        <th scope="col">Final</th>
        </tr>
        </thead>
        <tbody id="tournamentData">
        <!-- JavaScript로 생성될 내용이 여기에 들어갈 것입니다. -->
        </tbody>
        </table>
        </div>
        
        <div class="container">
        <div class="text-end" id="btn">
        <button type="button" class="btn btn-primary" id="goBackButton">돌아가기</button>
        </div>
        <script src="tournamentData.js"></script>
        </div>
        
        </body>
		`;
    }
    // 토너먼트 데이터를 표에 채우는 함수
    populateTable(data) {
        let tbody = document.getElementById("tournamentData");
        data.tournamentLog.forEach(function (tournament) {
            let tr = document.createElement("tr");
            // Timestamp 추가
            let tdTimestamp = document.createElement("td");
            let timestamp = new Date(tournament.tournament[0].timestamp * 1000);
            let options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            };
            let formattedTimestamp = timestamp.toLocaleDateString('en-GB', options).replace(/\//g, '.').replace(",", "");
            tdTimestamp.textContent = formattedTimestamp;
            tr.appendChild(tdTimestamp);

            // 플레이어 데이터 추가
            for (let i = 1; i < tournament.tournament.length; i++) {
                let tdPlayer = document.createElement("td");
                let playerA = tournament.tournament[i].playerA.name + " " + tournament.tournament[i].playerA.score + " " + (tournament.tournament[i].playerA.score > tournament.tournament[i].playerB.score ? "W" : "L");
                let playerB = tournament.tournament[i].playerB.name + " " + tournament.tournament[i].playerB.score + " " + (tournament.tournament[i].playerB.score > tournament.tournament[i].playerA.score ? "W" : "L");
                tdPlayer.innerHTML = `${playerA}<br>${playerB}`;
                tr.appendChild(tdPlayer);
            }

            // 행 추가
            tbody.appendChild(tr);
        });
    }

    // 페이지가 로드될 때 테이블을 채우도록 호출
    goBack() {
        window.history.back();
    }

    handleRoute() {

        const queryString = location.search;

        (async function (callback) {
            try {
                const fetchModule = new FetchModule();
                const response = await fetchModule.request(new Request(`${BACKEND_URL}/dashboard${queryString}`, {
                    method: 'GET',
                    credentials: "include"
                }));
                if (response.ok) {
                    const data = await response.json();
                    callback(data);
                    // this.populateTable(data);
                }
                else
                    throw new Error(response.statusText);
            } catch (error) {
                console.log(error.message);
            }
        })(this.populateTable);

        // fetch("http://localhost:8000/dashboard")
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         this.populateTable(data);
        //     });

        const goBackBtn = document.querySelector("#goBackButton");
        goBackBtn.addEventListener("click", event => {
            this.goBack();
        });
    }
}
