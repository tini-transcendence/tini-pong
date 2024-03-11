from base64 import urlsafe_b64encode
from json import dumps
from hmac import digest
from hashlib import sha256


class __JWT:
    alg = "HS256"
    typ = "JWT"

    def create_jwt(
        self, data: dict, secret: str, expire_time: int | None = None
    ) -> str:
        # TODO: Registered Claim 확인 필요
        self.__validate_create_jwt_args(data, secret, expire_time)

        header = self.__make_header()
        payload = self.__make_payload(data, expire_time)
        signature = self.__make_signature(secret, header, payload)

        token = ".".join([header, payload, signature])
        return token

    def __validate_create_jwt_args(
        self, payload: dict, secret: str, expire_time: int | None
    ):
        if not isinstance(payload, dict):
            raise PayloadError()
        if not type(secret) is str:
            raise SecretError()
        if expire_time and not type(expire_time) is int:
            raise ExpireTimeError()

    def __make_header(self) -> str:
        header_json = dumps({"alg": self.alg, "typ": self.typ}).encode("utf-8")
        header = str(urlsafe_b64encode(header_json), "utf-8").rstrip("=")
        return header

    def __make_payload(self, data: dict, expire_time: int) -> str:
        payload_json = dumps(data).encode("utf-8")
        payload = str(urlsafe_b64encode(payload_json), "utf-8").rstrip("=")
        return payload

    def __make_signature(self, secret: str, header: str, payload: str) -> str:
        signature_digest = digest(
            secret.encode(), (header + "." + payload).encode(), sha256
        )
        signature = str(urlsafe_b64encode(signature_digest), "utf-8").rstrip("=")
        return signature


class PayloadError(Exception):
    def __init__(self):
        super().__init__("argument 'payload' should be dictionary type")


class SecretError(Exception):
    def __init__(self):
        super().__init__("argument 'secret' should be string type")


class ExpireTimeError(Exception):
    def __init__(self):
        super().__init__("argument 'expire_time' should be integer type")


__jwt = __JWT()
create = __jwt.create_jwt
