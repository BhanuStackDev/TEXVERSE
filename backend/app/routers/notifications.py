from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user,require_role
from app.models import Notification
router=APIRouter(prefix='/notifications',tags=['Notifications'])
@router.get('')
def list_notifications(user=Depends(get_current_user),db:Session=Depends(get_db)): return db.query(Notification).filter(Notification.user_id==user.id).order_by(Notification.created_at.desc()).all()
@router.patch('/{notification_id}/read')
def read(notification_id:int,user=Depends(get_current_user),db:Session=Depends(get_db)):
 x=db.query(Notification).filter(Notification.id==notification_id,Notification.user_id==user.id).first()
 if not x: return {'message':'Not found'}
 x.read=True;db.commit();return x
