import click
from . import app


@click.command()
@click.option('-p', '--port', default=5000, help='specify alternative port number')
def serve(port):
    app.run(host="0.0.0.0", port=port)
