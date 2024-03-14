from executeFunction import retrieve_transaction, store_transaction
import time


class Tournament:
    def __init__(self):
        self.tournament = []

    @staticmethod
    def make_player(name, score):
        return {"name": name, "score": score}

    def add_game_log(self, playerA, playerB, index):
        self.tournament.append({"index": index, "playerA": playerA, "playerB": playerB})

    def add_timestamp(self):
        self.tournament.append(int(time.time()))


# retrieve_transaction()

# t = Tournament()
# t.add_timestamp()
# t.add_game_log(t.make_player("asdf", 1), t.make_player("b", 0), 1)
# t.add_game_log(t.make_player("ffffffff", 2), t.make_player("b", 1), 2)
# t.add_game_log(t.make_player("asdf", 3), t.make_player("b", 2), 3)


# store_transaction(t.tournament)

# ta = Tournament()
# ta.add_timestamp()
# ta.add_game_log(ta.make_player("c", 5), ta.make_player("d", 0), 1)
# ta.add_game_log(ta.make_player("c", 5), ta.make_player("d", 1), 2)
# ta.add_game_log(ta.make_player("c", 3), ta.make_player("d", 5), 3)


# store_transaction(ta.tournament)


retrieve_transaction()
