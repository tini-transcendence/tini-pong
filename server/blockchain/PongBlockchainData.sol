// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

contract TournamentContract {
    struct Player {
        string name;
        uint8 score;
    }

    struct Game {
        uint8 index;
        Player playerA;
        Player playerB;
    }

    struct Tournament {
        uint time;
        Game game1;
        Game game2;
        Game game3;
    }

    Tournament[] tournaments;

    // 값 설정 함수
    function store(Tournament memory input_tournament) public {
        tournaments.push(input_tournament);
    }

    // 값을 가져오는 함수
    function retrieve() public view returns (Tournament[] memory) {
        return tournaments;
    }
}