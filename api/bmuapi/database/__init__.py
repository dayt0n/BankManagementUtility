from sqlalchemy import inspect
from sqlalchemy.ext.declarative import as_declarative
import re


@as_declarative()
class Base(object):
    def _asdict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


noCommaRegex = re.compile(r",")
moneyRegex = re.compile(r"\$([\d.]+)")
