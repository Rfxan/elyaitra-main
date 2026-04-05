from app.db.database import engine, Base
from app.models.user import User
from app.models.payment import Payment
from app.models.flashcard import Flashcard
from app.models.flowchart import Flowchart

def init_db():
    Base.metadata.create_all(bind=engine)
