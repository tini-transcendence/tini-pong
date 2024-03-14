import json, os
from web3 import Web3
from solcx import compile_standard, install_solc
from dotenv import load_dotenv


# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# DEPLOY_ARTIFACTS_DIR = os.path.join(BASE_DIR, "blockchain/contractOutputs/")
DEPLOY_ARTIFACTS_DIR = "./deploy_artifacts/"
SOLIDITY_FILE = "PongBlockchainData.sol"

ABI_FILE = os.path.join(DEPLOY_ARTIFACTS_DIR, "abi.json")


def compile_solidity():
    print("------------------")
    contract = "TournamentContract"

    sol_file_path = os.path.join(".", SOLIDITY_FILE)

    if not os.path.isfile(sol_file_path):
        print(f"Error: Wrong solidity file name or extension.")
        return
    else:
        with open(sol_file_path, "r") as f:
            contract_source = f.read()

    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {SOLIDITY_FILE: {"content": contract_source}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.13",
    )

    abi = compiled_sol["contracts"][SOLIDITY_FILE][contract]["abi"]

    bytecode = compiled_sol["contracts"][SOLIDITY_FILE][contract]["evm"]["bytecode"][
        "object"
    ]

    with open(ABI_FILE, "w") as abi_file:
        json.dump(abi, abi_file)

    print(f"ABI saved to {ABI_FILE}")

    return abi, bytecode
