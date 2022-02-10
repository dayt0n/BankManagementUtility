import click
from . import app


@click.command()
@click.option('-p', '--port', default=8080, help='specify alternative port number')
def serve(port):
    app.run()
