"""empty message

Revision ID: 97553cf4fb5e
Revises: 350bf72b427e
Create Date: 2023-08-30 17:48:57.272445

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '97553cf4fb5e'
down_revision = '350bf72b427e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('oscillators', schema=None) as batch_op:
        batch_op.add_column(sa.Column('number', sa.Integer(), nullable=False))
        batch_op.add_column(sa.Column('osc_type', sa.String(length=20), nullable=False))
        batch_op.add_column(sa.Column('gain', sa.Numeric(precision=3, scale=2), nullable=False))
        batch_op.add_column(sa.Column('attack', sa.Numeric(precision=3, scale=2), nullable=False))
        batch_op.add_column(sa.Column('decay', sa.Numeric(precision=3, scale=2), nullable=False))
        batch_op.add_column(sa.Column('sustain', sa.Numeric(precision=3, scale=2), nullable=False))
        batch_op.add_column(sa.Column('release', sa.Numeric(precision=3, scale=2), nullable=False))
        batch_op.add_column(sa.Column('patch_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, 'patches', ['patch_id'], ['id'])
        batch_op.drop_column('type')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('oscillators', schema=None) as batch_op:
        batch_op.add_column(sa.Column('type', sa.VARCHAR(length=50), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('patch_id')
        batch_op.drop_column('release')
        batch_op.drop_column('sustain')
        batch_op.drop_column('decay')
        batch_op.drop_column('attack')
        batch_op.drop_column('gain')
        batch_op.drop_column('osc_type')
        batch_op.drop_column('number')

    # ### end Alembic commands ###