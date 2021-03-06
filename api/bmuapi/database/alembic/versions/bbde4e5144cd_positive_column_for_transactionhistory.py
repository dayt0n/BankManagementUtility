"""positive column for TransactionHistory

Revision ID: bbde4e5144cd
Revises: 202898666715
Create Date: 2022-04-21 13:48:48.248559

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bbde4e5144cd'
down_revision = '202898666715'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction_history', sa.Column('positive', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('transaction_history', 'positive')
    # ### end Alembic commands ###
