import setuptools

setuptools.setup(
    name="bmuapi",
    version="0.0.1",
    description="API for a Bank Management Utility",
    url="https://github.com/dayt0n/BankManagementUtility",
    packages=setuptools.find_packages(),
    install_requires=['click', 'flask', 'arrow', 'pyjwt[crypto]',
                      'python-dotenv', 'psycopg2', 'sqlalchemy', 'passlib', 'phonenumbers', 'Flask-APScheduler'],
    entry_points={
        'console_scripts': [
            'bmuapi = bmuapi.cli:serve'
        ],
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.10',
)
