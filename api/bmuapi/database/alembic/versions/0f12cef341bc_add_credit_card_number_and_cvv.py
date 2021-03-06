"""add credit card number and cvv

Revision ID: 0f12cef341bc
Revises: 503874650e26
Create Date: 2022-04-12 18:07:44.170631

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f12cef341bc'
down_revision = '503874650e26'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('credit_cards', sa.Column('cardNumber', sa.Integer(), nullable=True))
    op.add_column('credit_cards', sa.Column('cvv', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('credit_cards', 'cvv')
    op.drop_column('credit_cards', 'cardNumber')
    # ### end Alembic commands ###
