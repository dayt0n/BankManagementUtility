import click
from . import app
from bmuapi.scheduling import scheduler


@click.command()
@click.option('-p', '--port', default=5000, help='specify alternative port number')
def serve(port):
    scheduler.init_app(app)
    scheduler.start()

    app.run(host="0.0.0.0", port=port)
