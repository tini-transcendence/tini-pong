from blockchain.executeFunction import store_transaction
from celery import shared_task


@shared_task
def store_tournament_data(tournament_info):
	store_transaction(tournament_info)
