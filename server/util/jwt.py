from base64 import urlsafe_b64encode, urlsafe_b64decode
from json import dumps, loads
from hmac import digest
from hashlib import sha256

from .timestamp import get_timestamp


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
        decoded_payload = self.__decode_data(payload)
        return decoded_payload

    def validate_jwt(self, token: str, secret: str) -> bool:
        parts = token.split(".")
        if len(parts) != 3:
            return False
        header, payload, signature = parts
        try:
            decoded_header = self.__decode_data(header)
            self.__validate_header(decoded_header)
            decoded_payload = self.__decode_data(payload)
            if "exp" in decoded_payload:
                return decoded_payload["exp"] > get_timestamp()
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
        header_data = {"alg": self.alg, "typ": self.typ}
        header = self.__encode_data(header_data)
        return header

    def __make_payload(self, data: dict, expire_time: int | None) -> str:
        payload_data = dict(data)
        if expire_time:
            payload_data["exp"] = expire_time
        payload = self.__encode_data(payload_data)
        return payload

    def __make_signature(self, secret: str, header: str, payload: str) -> str:
        signature_digest = digest(
            secret.encode(), (header + "." + payload).encode(), sha256
        )
        signature = str(urlsafe_b64encode(signature_digest), "utf-8").rstrip("=")
        return signature

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

    def __encode_data(self, data: dict) -> str:
        data_json = dumps(data).encode("utf-8")
        encoded_data = str(urlsafe_b64encode(data_json), "utf-8").rstrip("=")
        return encoded_data

    def __decode_data(self, data: dict) -> dict:
        padded_data = data + "=" * (4 - len(data) % 4)
        decoded_data = loads(urlsafe_b64decode(padded_data))
        return decoded_data


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
