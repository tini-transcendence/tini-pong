import aiohttp


async def get(url, headers):
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers, ssl=False) as response:
            response.data = await response.json()
            return response


async def post(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=data, ssl=False) as response:
            response.data = await response.json()
            return response
