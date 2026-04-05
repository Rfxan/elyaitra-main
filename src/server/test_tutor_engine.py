import sys
import os

# Put app into python path
sys.path.append(os.getcwd())

from app.api.ai import tutor_engine
from app.api.ai import TutorRequest

def test_tutor():
    print("🧪 TESTING TUTOR ENGINE MANUALLY...")
    try:
        req = TutorRequest(
            user_id=1,
            subject="chemistry",
            unit="1",
            topic="Atomic Structure",
            mode="chat",
            message="What is an atom?"
        )
        
        print(f"Sending message: {req.message}")
        result = tutor_engine.respond(
            user_id=req.user_id,
            subject=req.subject,
            unit=req.unit,
            topic=req.topic,
            mode=req.mode,
            message=req.message
        )
        
        print("✅ RESPONSE SUCCESS!")
        print(f"--- ANSWER ---\n{result['answer']}\n--------------")
        
    except Exception as e:
        print(f"❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_tutor()
