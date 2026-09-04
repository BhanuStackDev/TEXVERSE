from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.auth import get_current_user, require_role
from app.models import SupportTicket


router = APIRouter(
    prefix="/support",
    tags=["Support"],
)


class TicketIn(BaseModel):
    subject: str
    message: str


class TicketStatusIn(BaseModel):
    status: str


@router.post("/ticket", status_code=201)
def ticket(
    data: TicketIn,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    support_ticket = SupportTicket(
        user_id=user.id,
        **data.model_dump(),
    )

    db.add(support_ticket)
    db.commit()
    db.refresh(support_ticket)

    return support_ticket


@router.get("/mine")
def mine(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(SupportTicket)
        .filter(SupportTicket.user_id == user.id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )


@router.get("/all")
def all_tickets(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return (
        db.query(SupportTicket)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )


@router.patch("/{ticket_id}/status")
def update_ticket_status(
    ticket_id: int,
    data: TicketStatusIn,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    support_ticket = db.get(SupportTicket, ticket_id)

    if not support_ticket:
        raise HTTPException(
            status_code=404,
            detail="Support ticket not found",
        )

    allowed_statuses = {
        "Open",
        "In Progress",
        "Resolved",
        "Closed",
    }

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid support ticket status",
        )

    support_ticket.status = data.status

    db.commit()
    db.refresh(support_ticket)

    return support_ticket