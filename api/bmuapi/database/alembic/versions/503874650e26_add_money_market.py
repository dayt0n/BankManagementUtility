"""add money market

Revision ID: 503874650e26
Revises: f29d6433a6af
Create Date: 2022-04-11 15:41:43.117006

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '503874650e26'
down_revision = 'f29d6433a6af'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user_accounts', sa.Column(
        'openDate', postgresql.TIMESTAMP(timezone=True), nullable=True))
    op.add_column('user_accounts', sa.Column(
        'mmAcctID', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'user_accounts',
                          'money_market', ['mmAcctID'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    #op.drop_constraint(None, 'user_accounts', type_='foreignkey')
    op.drop_column('user_accounts', 'mmAcctID')
    op.drop_column('user_accounts', 'openDate')
    op.drop_table("money_market")
    # ### end Alembic commands ###