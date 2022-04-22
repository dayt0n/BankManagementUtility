from operator import and_
import os
import random
import shutil
import string
import requests
from fillpdf import fillpdfs
from bmuapi.database.tables import User, UserInterest
from bmuapi.database.database import SessionManager


# https://www.askpython.com/python/examples/generate-random-strings-in-python
def random_string(size):
    return ''.join(random.choice(string.ascii_letters) for x in range(size))


def download_file(file):
    fileName = f'/tmp/{random_string(6)}_' + file.split('/')[-1]
    with requests.get(file, stream=True) as req:
        with open(fileName, 'wb') as fp:
            shutil.copyfileobj(req.raw, fp, length=16*1024)
    return fileName


def get_1099_pdf():
    return download_file('https://www.irs.gov/pub/irs-pdf/f1099int.pdf')


def fill_address(file, usr: User):
    # PAYER'S name, street address, city or town, state or province, country, ZIP or foreign postal code, and telephone no.
    temp1 = file.split('.')[0] + '_temp1.pdf'
    temp2 = file.split('.')[0] + '_temp2.pdf'
    shutil.copyfile(file, temp1)
    shutil.copyfile(file, temp2)
    fillpdfs.place_text(os.getenv("BANK_NAME"), 60, 75, temp1, temp2,
                        page_number=3, font_size=8, color=(0, 0, .545))
    fillpdfs.place_text(os.getenv("BANK_STREET"), 60, 85, temp2, temp1,
                        page_number=3, font_size=8, color=(0, 0, .545))
    fillpdfs.place_text(', '.join((os.getenv("BANK_CITY"), os.getenv("BANK_STATE"), os.getenv("BANK_COUNTRY"), os.getenv("BANK_ZIP"))), 60, 95, temp1, temp2,
                        page_number=3, font_size=8, color=(0, 0, .545))
    fillpdfs.place_text(os.getenv("BANK_PHONE"), 60, 105, temp2, temp1,
                        page_number=3, font_size=8, color=(0, 0, .545),)
    os.remove(temp2)
    os.rename(temp1, file)


def fill_out_1099(usr: User, year, session=None):
    file = get_1099_pdf()
    if len(year) != 4:
        return None
    fill_address(file, usr)
    fields = fillpdfs.get_form_fields(file, page_number=3)
    # fillpdfs.print_form_fields(file, page_number=3)
    # for calendar year
    fields['FEFF00430061006C0065006E00640061007200590065006100720032005F0031005B0030005D'] = year[-2:]
    # i think these are the checkboxes, but we don't do anything with this
    # fields['FEFF00630032005F0031005B0030005D'] = 'On'
    # fields['FEFF00630032005F0031005B0031005D'] = 'On'
    # PAYER'S name, street address, city or town, state or province, country, ZIP or foreign postal code, and telephone no.
    # PAYER'S TIN
    fields['FEFF00660032005F0032005B0030005D'] = os.getenv("BANK_TIN")
    # Recipient's TIN
    fields['FEFF00660032005F0033005B0030005D'] = usr.ssn
    # Recipient's name
    fields['FEFF00660032005F0034005B0030005D'] = usr.name
    # street address
    addrSplit = usr.address.split(',')
    fields['FEFF00660032005F0035005B0030005D'] = addrSplit[0]
    # city or town
    fields['FEFF00660032005F0036005B0030005D'] = f"{addrSplit[1]}, {addrSplit[2]}, {os.getenv('BANK_COUNTRY')}, {addrSplit[-1]}"
    # FATCA filing requirement (I think)
    # fields['FEFF00630032005F0032005B0030005D'] = 'Off'
    # Account number (see instructions) - we don't need since we are giving 1099-INTs for everyone
    # fields['FEFF00660032005F0037005B0030005D'] = usr.id
    # Payer's RTN (optional, basically routing number)
    fields['FEFF00660032005F0038005B0030005D'] = os.getenv("ROUTING_NUMBER")
    with SessionManager(commit=False, session=session) as sess:
        userInterest = sess.query(UserInterest).filter(
            and_(UserInterest.userID == usr.id, UserInterest.year == int(year))).first()
        if not userInterest:
            return None
        # 1. Interest Income
        fields['FEFF00660032005F0039005B0030005D'] = str(userInterest.interest)
    # 2. early withdraw penalty
    fields['FEFF00660032005F00310030005B0030005D'] = '0.00'  # we don't do CDs
    # 3. Interest on U.S. Savings Bonds and Treasury obligations
    fields['FEFF00660032005F00310031005B0030005D'] = '0.00'  # we don't do bonds
    # 4. Federal income tax withheld (I have no idea where this is)
    # 5. Investment Expenses (only for REMICs)
    fields['FEFF00660032005F00310033005B0030005D'] = '0.00'
    # 6. Foreign Tax paid
    fields['FEFF00660032005F00310034005B0030005D'] = '0.00'
    # 7. Foreign country or U.S. possession
    fields['FEFF00660032005F00310035005B0030005D'] = ''
    # 8. Tax-exempt interest
    fields['FEFF00660032005F00310036005B0030005D'] = '0.00'  # no roth IRAs here
    # 9. Specified private activity bond interest
    # we don't do bonds either
    fields['FEFF00660032005F00310037005B0030005D'] = '0.00'
    # 10. Market discount
    fields['FEFF00660032005F00310038005B0030005D'] = '0.00'
    # 11. Bond Premium
    fields['FEFF00660032005F00310039005B0030005D'] = '0.00'
    # 12. Bond premium on Treasury obligations
    fields['FEFF00660032005F00320030005B0030005D'] = '0.00'
    # 13. Bond premium on tax-exempt bond
    fields['FEFF00660032005F00320031005B0030005D'] = '0.00'
    # 14. Tax-exempt and tax credit bond CUSIP no
    fields['FEFF00660032005F00320032005B0030005D'] = ''
    # 15. State
    fields['FEFF00660032005F00320033005B0030005D'] = os.getenv("BANK_STATE")
    # 16. State identification no
    fields['FEFF00660032005F00320034005B0030005D'] = os.getenv(
        "BANK_STATE_ID_NO")
    # 17. State tax withheld
    fields['FEFF00660032005F00320035005B0030005D'] = '0.00'
    # 15. pt 2
    fields['FEFF00660032005F00320036005B0030005D'] = ''
    # 16. pt 2
    fields['FEFF00660032005F00320037005B0030005D'] = ''
    # 17. pt 2
    fields['FEFF00660032005F00320038005B0030005D'] = ''
    newFile = file.rsplit('.', 1)[0] + '_new.pdf'
    fillpdfs.write_fillable_pdf(file, newFile, fields, flatten=True)
    os.remove(file)
    return newFile
