import json, os
from web3 import Web3
from solcx import compile_standard, install_solc
from dotenv import load_dotenv
from compile_sol import compile_solidity

install_solc("0.8.13")
load_dotenv()

DEPLOY_ARTIFACTS_DIR = "./deploy_artifacts/"
CONTRACT_ADDRESS = os.path.join(DEPLOY_ARTIFACTS_DIR, "contract_address.json")

# Set the variables for the contract

# infura로 sepolia 테스트 서버 활성화
w3 = Web3(Web3.HTTPProvider(os.getenv("WEB3_PROVIDER")))
chain_id = int(os.getenv("CHAIN_ID"))

# Connect to Metamask(정보 입력)
my_address = os.getenv("MY_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")
# 보안을 위해서 개인키 env화
# print(private_key)


def deploy_contract(abi, bytecode):
    # Create the contract in Python
    PongBlockchainData = w3.eth.contract(abi=abi, bytecode=bytecode)

    # Get the latest transaction
    nonce = w3.eth.get_transaction_count(my_address)
    # print(nonce)

    # 1. Build a transaction
    # 2. Sign a transaction
    # 3. Send a transaction

    # Build a transaction
    transaction = PongBlockchainData.constructor().build_transaction(
        {
            "chainId": chain_id,
            "gasPrice": w3.eth.gas_price,
            "from": my_address,
            "nonce": nonce,
        }
    )
    # Sign a transaction
    signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)

    # Send a transaction
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

    # Wait for transaction completion.
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    contract_address = tx_receipt["contractAddress"]
    print(f"Contract deployed to {contract_address}")

    with open(CONTRACT_ADDRESS, "w") as f:
        json.dump({"contractAddress": contract_address}, f)
    print(f"Contract address saved to {CONTRACT_ADDRESS}")


abi = ""
bytecode = ""

abi, bytecode = compile_solidity()
deploy_contract(abi, bytecode)
