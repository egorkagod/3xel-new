# Email service
class InvalidCode(Exception): pass
class FailedToSendCode(Exception): pass
class EmailMismatchError(Exception): pass
class CodeResendTooSoonError(Exception): pass

# User service
class UserExists(Exception): pass
class UserCreationFailed(Exception): pass
