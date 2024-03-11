from base64 import urlsafe_b64encode, urlsafe_b64decode
from json import dumps, loads
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

    def decode_jwt(self, token: str) -> dict:
        payload = token.split(".")[1]
        decoded_payload = self.__decode_payload(payload)
        return decoded_payload

    def validate_jwt(self, token: str, secret: str) -> bool:
        parts = token.split(".")
        if len(parts) != 3:
            return False
        header, payload, signature = parts
        try:
            decoded_header = self.__decode_header(header)
            self.__validate_header(decoded_header)
            self.__decode_payload(payload)
        except HeaderNotSupportError as error:
            raise error
        except:
            return False
        return self.__validate_signature(header, payload, signature, secret)

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

    def __decode_header(self, header: str) -> dict:
        padded_header = header + "=" * (4 - len(header) % 4)
        decoded_header = loads(urlsafe_b64decode(padded_header))
        return decoded_header

    def __decode_payload(self, payload: str) -> dict:
        padded_payload = payload + "=" * (4 - len(payload) % 4)
        decoded_payload = loads(urlsafe_b64decode(padded_payload))
        return decoded_payload

    def __validate_header(self, header: dict):
        alg = header.get("alg")
        typ = header.get("typ")
        if alg != "HS256" or typ != "JWT":
            raise HeaderNotSupportError(alg, typ)

    def __validate_signature(
        self, header: str, payload: str, signature: str, secret: str
    ) -> bool:
        valid_signature = self.__make_signature(secret, header, payload)
        return signature == valid_signature


class PayloadError(Exception):
    def __init__(self):
        super().__init__("argument 'payload' should be dictionary type")


class SecretError(Exception):
    def __init__(self):
        super().__init__("argument 'secret' should be string type")


class ExpireTimeError(Exception):
    def __init__(self):
        super().__init__("argument 'expire_time' should be integer type")


class HeaderNotSupportError(Exception):
    def __init__(self, alg, typ):
        super().__init__("alg '%s' or typ '%s' not supported" % (alg, typ))


__jwt = __JWT()
create = __jwt.create_jwt
decode = __jwt.decode_jwt
validate = __jwt.validate_jwt
