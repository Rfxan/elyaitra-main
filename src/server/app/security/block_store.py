import json
import os
import time
from typing import List, Dict, Any, Optional
import threading

# A simple block list for security threats
class BlockStore:
    def __init__(self, persistence_file: str = "blocked_threats.json"):
        self.persistence_file = persistence_file
        self.blocked_items: List[Dict[str, Any]] = []
        self._lock = threading.Lock()
        self._load()

    def _load(self):
        if os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, 'r') as f:
                    self.blocked_items = json.load(f)
            except Exception as e:
                print(f"Error loading block list: {e}")
                self.blocked_items = []

    def _save(self):
        try:
            with open(self.persistence_file, 'w') as f:
                json.dump(self.blocked_items, f, indent=2)
        except Exception as e:
            print(f"Error saving block list: {e}")

    def block(self, type: str, value: str, reason: str, alert_id: Optional[str] = None):
        with self._lock:
            # Check for existing block
            for item in self.blocked_items:
                if item["type"] == type and item["value"] == value:
                    return item
            
            new_block = {
                "id": f"block-{int(time.time() * 1000)}",
                "type": type, # 'ip' | 'file' | 'endpoint'
                "value": value,
                "reason": reason,
                "blockedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
                "alertId": alert_id
            }
            self.blocked_items.append(new_block)
            self._save()
            return new_block

    def unblock(self, id: str):
        with self._lock:
            original_len = len(self.blocked_items)
            self.blocked_items = [b for b in self.blocked_items if b["id"] != id]
            if len(self.blocked_items) < original_len:
                self._save()
                return True
            return False

    def get_all(self):
        with self._lock:
            return list(self.blocked_items)

# Global singleton
GLOBAL_BLOCK_STORE = BlockStore()
