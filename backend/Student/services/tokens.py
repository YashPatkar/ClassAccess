from django.core.signing import TimestampSigner

signer = TimestampSigner()

def generate_file_token(session_id):
    return signer.sign(session_id)

def verify_file_token(token, max_age=300):
    return signer.unsign(token, max_age=max_age)
