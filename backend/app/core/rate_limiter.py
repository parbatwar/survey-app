from collections import defaultdict, deque
from threading import Lock
from time import time

from fastapi import HTTPException, Request, status

SUBMISSION_LIMIT = 5
WINDOW_SECONDS = 60

_requests: dict[str, deque] = defaultdict(deque)
_lock = Lock()


def check_submission_rate_limit(
    request: Request,
    survey_id: int,
) -> None:
    """
    Allow a maximum number of survey submissions
    per IP address, per survey, within the time window.
    """

    client_ip = request.client.host if request.client else "unknown"

    key = f"{client_ip}:{survey_id}"

    now = time()
    window_start = now - WINDOW_SECONDS

    with _lock:
        timestamps = _requests[key]

        # Remove expired requests
        while timestamps and timestamps[0] <= window_start:
            timestamps.popleft()

        # Too many recent submissions
        if len(timestamps) >= SUBMISSION_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=("Too many submissions. " "Please try again in a minute."),
            )

        timestamps.append(now)
