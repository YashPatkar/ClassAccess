import random, string
def generate_code(length=5):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))