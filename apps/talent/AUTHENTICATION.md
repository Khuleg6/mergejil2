# Authentication setup

Teacher passwords are hashed with bcrypt. Successful teacher and student logins create a random opaque session token; only its SHA-256 hash is stored in PostgreSQL, while the browser receives the token in an HttpOnly, SameSite=Lax cookie. Sessions expire after seven days.

## OTP providers

The current `OtpStore` implementation is a development fallback. It hashes codes, expires them after five minutes, limits requests to one per minute, limits verification attempts, and deletes a code after successful use. In development only, the request endpoint returns the code so the UI can display it.

Before production deployment, implement a Redis-backed `OtpStore` in `src/lib/otp-store.ts`, select it when `OTP_PROVIDER=redis`, and connect an SMS provider in the request route. Redis entries should have a five-minute TTL and issuance/verification counters should use atomic operations. Never return an OTP from a production response.

Student phone numbers must already belong to a `Student` record. Student creation belongs to the future teacher class-management milestone and is intentionally not faked here.
