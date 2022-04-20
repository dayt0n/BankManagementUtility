"""add last interest check date

Revision ID: 202898666715
Revises: ea2261c87cb7
Create Date: 2022-04-20 11:56:38.251580

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '202898666715'
down_revision = 'ea2261c87cb7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('checking_savings', sa.Column('lastInterestCheck', postgresql.TIMESTAMP(timezone=True), nullable=True))
    op.add_column('credit_cards', sa.Column('lastInterestCheck', postgresql.TIMESTAMP(timezone=True), nullable=True))
    op.add_column('money_market', sa.Column('lastInterestCheck', postgresql.TIMESTAMP(timezone=True), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('money_market', 'lastInterestCheck')
    op.drop_column('credit_cards', 'lastInterestCheck')
    op.drop_column('checking_savings', 'lastInterestCheck')
    # ### end Alembic commands ###
