import time
from typing import List, Dict, Any
import collections

# Simple thread-safe in-memory log store
# For a production system, this would be a database or Redis.
class LogStore:
    def __init__(self, maxsize: int = 500):
        self.logs = collections.deque(maxlen=maxsize)

    def add_log(self, data: Dict[str, Any]):
        if "timestamp" not in data:
            data["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S")
        else:
            # If it's a float timestamp, convert to string
            if isinstance(data["timestamp"], (int, float)):
                data["timestamp"] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(data["timestamp"]))
        
        # Format for front-end dashboard console-style view
        log_entry = f"[{data['timestamp']}] {data.get('method', 'LOG')} {data.get('path', '')} from {data.get('ip', 'local')}"
        if data.get('body'):
            # Clip body for display
            body_preview = str(data['body'])[:50] + ("..." if len(str(data['body'])) > 50 else "")
            log_entry += f" | data: {body_preview}"
            
        self.logs.appendleft(log_entry)

    def get_all(self) -> List[str]:
        return list(self.logs)

# Global singleton
GLOBAL_LOG_STORE = LogStore()
