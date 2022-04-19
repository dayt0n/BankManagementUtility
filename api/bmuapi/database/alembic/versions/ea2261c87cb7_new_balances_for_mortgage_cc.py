"""new balances for Mortgage/CC

Revision ID: ea2261c87cb7
Revises: fa85f28934dc
Create Date: 2022-04-18 21:49:59.089300

"""
from alembic import op
import sqlalchemy as sa
from bmuapi.database.tables import NumericMoney

# revision identifiers, used by Alembic.
revision = 'ea2261c87cb7'
down_revision = 'fa85f28934dc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('credit_cards', sa.Column(
        'statementBalance', NumericMoney(), nullable=True))
    op.add_column('mortgages', sa.Column(
        'totalOwed', NumericMoney(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('mortgages', 'totalOwed')
    op.drop_column('credit_cards', 'statementBalance')
    # ### end Alembic commands ###
