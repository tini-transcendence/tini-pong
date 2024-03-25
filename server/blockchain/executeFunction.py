import os, json
from web3 import Web3
from dotenv import load_dotenv
from .compile_sol import compile_solidity

# Input files
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# OUTPUTS_DIR = os.path.join(BASE_DIR, "blockchain/deploy_aritifacts/")
# ABI_FILE = os.path.join(OUTPUTS_DIR, "abi.json")
# CONTRACT_ADDRESS = os.path.join(OUTPUTS_DIR, "contract_address.json")

load_dotenv()

DEPLOY_ARTIFACTS_DIR = "blockchain/deploy_artifacts/"
ABI_FILE = os.path.join(DEPLOY_ARTIFACTS_DIR, "abi.json")
CONTRACT_ADDRESS = os.path.join(DEPLOY_ARTIFACTS_DIR, "contract_address.json")

# infura로 sepolia 테스트 서버 활성화
w3 = Web3(Web3.HTTPProvider(os.getenv("WEB3_PROVIDER")))
chain_id = int(os.getenv("CHAIN_ID"))

# Connect to Metamask(정보 입력)
my_address = os.getenv("MY_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")


def load_json_file(file_dir, key):
    with open(file_dir, "r") as f:
        data = json.load(f)
    return data[key] if key else data


abi = load_json_file(ABI_FILE, None)
contractAddress = load_json_file(CONTRACT_ADDRESS, "contractAddress")


def retrieve_transaction():
    # Working with the contract, you always need
    # 1. Contract Address
    # 2. Contract ABI

    # If env variables are missing, return an error for running the Django server
    if w3 is None or chain_id == 0 or my_address is None or private_key is None:
        print("Error: Some environment variables are missing.")
        return

    pong_tournament_storage = w3.eth.contract(address=contractAddress, abi=abi)
    print(
        "Retrieve transaction(raw data):",
        pong_tournament_storage.functions.retrieve().call(),
    )

    # Retrieve the log from the contract & sort by timestamp
    tournaments = pong_tournament_storage.functions.retrieve().call()
    tournaments = sorted(tournaments, key=lambda x: x[0], reverse=True)

    # Convert the log into a dictionary
    tournament_log = []
    for tournament in tournaments:
        tournament_info = []
        for idx, game in enumerate(tournament):
            if idx == 0:
                tournament_info.append({"timestamp": tournament[idx]})
            elif idx < 4:  # Limit to 3 iterations
                index, playerA, playerB = game
                game_info = {
                    "index": index,
                    "playerA": {"name": playerA[0], "score": playerA[1]},
                    "playerB": {"name": playerB[0], "score": playerB[1]},
                }
                tournament_info.append(game_info)
        tournament_log.append({"tournament": tournament_info})

    # print("================foramt================")
    # print(tournament_log)

    tournament_log_data = {
        "tournamentLog": tournament_log,
        "etherscan": f"https://goerli.etherscan.io/address/{contractAddress}",
    }

    # Convert the dictionary to JSON format
    json_data = json.dumps(tournament_log_data, ensure_ascii=False, indent=4)
    return json_data

    # CAll -> Simulate making the call and getting a return value
    # Transact -> Actually make a state change
    # print(pong_tournament_storage.functions.retrieve().call())
    # Initial value of favorite number
    # print(pong_tournament_storage.functions.store(15).call())


def store_transaction(tournament_info):
    pong_tournament_storage = w3.eth.contract(address=contractAddress, abi=abi)
    nonce = w3.eth.get_transaction_count(my_address)
    store_transaction = pong_tournament_storage.functions.store(
        tournament_info
    ).build_transaction({"chainId": chain_id, "from": my_address, "nonce": nonce})

    signed_store_txn = w3.eth.account.sign_transaction(
        store_transaction, private_key=private_key
    )

    send_store_tx = w3.eth.send_raw_transaction(signed_store_txn.rawTransaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(send_store_tx)

    # print(pong_tournament_storage.functions.getGames().call())
