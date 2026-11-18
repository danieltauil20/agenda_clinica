import os
from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from datetime import datetime
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Importamos la base de datos y los modelos profesionales desde models.py
from models import db, Paciente, Cita, Visita, Presupuesto, LineaPresupuesto

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_super_segura'
CORS(app)

# Importante para pruebas locales con http://
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
CLIENT_SECRETS_FILE = 'credentials.json'

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///clinica_real.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializamos db con nuestra app
db.init_app(app)

with app.app_context():
    db.create_all()


# --- RUTAS DE PACIENTES ---
@app.route('/pacientes', methods=['GET'])
def listar_pacientes():
    pacientes = Paciente.query.all()
    resultado = [{
        "id": p.id,
        "nombre": p.nombre,
        "tipo_doc": p.tipo_doc,
        "num_doc": p.num_doc,
        "telefono": p.telefono,
        "email": p.email,
        "direccion": p.direccion,
        "contacto_emergencia": p.contacto_emergencia,
        "tel_emergencia": p.tel_emergencia,
        "alergias": p.alergias,
        "antecedentes": p.antecedentes,
        "lopd": p.lopd,
        "total_visitas": len(p.visitas),
        "total_presupuestos": len(p.presupuestos)
    } for p in pacientes]
    return jsonify(resultado), 200


@app.route('/pacientes', methods=['POST'])
def crear_paciente():
    datos = request.get_json()
    nuevo = Paciente(
        nombre=datos.get('nombre'),
        tipo_doc=datos.get('tipo_doc', 'DNI'),
        num_doc=datos.get('num_doc'),
        telefono=datos.get('telefono'),
        email=datos.get('email'),
        direccion=datos.get('direccion'),
        contacto_emergencia=datos.get('contacto_emergencia'),
        tel_emergencia=datos.get('tel_emergencia'),
        alergias=datos.get('alergias'),
        antecedentes=datos.get('antecedentes'),
        lopd=datos.get('lopd', False)
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({"mensaje": "¡Paciente registrado con éxito!", "id": nuevo.id}), 201


@app.route('/pacientes/<int:id>', methods=['GET'])
def ver_paciente(id):
    p = Paciente.query.get_or_404(id)
    visitas_list = [{
        "id": v.id,
        "fecha": v.fecha,
        "tratamiento": v.tratamiento,
        "pieza_dental": v.pieza_dental,
        "coste": v.coste
    } for v in p.visitas]
    
    presupuestos_list = [{
        "id": pr.id,
        "fecha": pr.fecha,
        "estado": pr.estado,
        "total": pr.total
    } for pr in p.presupuestos]

    return jsonify({
        "id": p.id,
        "nombre": p.nombre,
        "tipo_doc": p.tipo_doc,
        "num_doc": p.num_doc,
        "telefono": p.telefono,
        "email": p.email,
        "direccion": p.direccion,
        "contacto_emergencia": p.contacto_emergencia,
        "tel_emergencia": p.tel_emergencia,
        "alergias": p.alergias,
        "antecedentes": p.antecedentes,
        "lopd": p.lopd,
        "visitas": visitas_list,
        "presupuestos": presupuestos_list
    }), 200


# --- RUTAS DE VISITAS (HISTORIAL CLÍNICO) ---
@app.route('/pacientes/<int:id>/visitas', methods=['POST'])
def agregar_visita(id):
    Paciente.query.get_or_404(id)
    datos = request.get_json()
    
    nueva_visita = Visita(
        paciente_id=id,
        fecha=datos.get('fecha', datetime.now().strftime('%d/%m/%Y')),
        tratamiento=datos.get('tratamiento'),
        pieza_dental=datos.get('pieza_dental'), # Soporte para el odontograma
        coste=datos.get('coste', 0.0)
    )
    db.session.add(nueva_visita)
    db.session.commit()
    return jsonify({"mensaje": "¡Visita añadida al historial clínico con éxito!"}), 201


# --- RUTAS DE GOOGLE CALENDAR & OAUTH ---
@app.route('/auth/login')
def auth_login():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=url_for('auth_callback', _external=True)
    )
    authorization_url, state = flow.authorization_url(
        prompt='consent',
        include_granted_scopes='true'
    )
    session['state'] = state
    session['code_verifier'] = flow.code_verifier
    return redirect(authorization_url)


@app.route('/auth/callback')
def auth_callback():
    state = session.get('state')
    
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        state=state,
        redirect_uri=url_for('auth_callback', _external=True)
    )
    
    if 'code_verifier' in session:
        flow.code_verifier = session['code_verifier']
    
    flow.fetch_token(authorization_response=request.url)
    
    credentials = flow.credentials
    session['credentials'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
    
    return jsonify({"mensaje": "¡Autenticación con Google Calendar exitosa!"})


@app.route('/calendar/citas', methods=['GET'])
def listar_citas_calendario():
    if 'credentials' not in session:
        return redirect(url_for('auth_login'))
    
    creds_data = session['credentials']
    creds = Credentials(**creds_data)
    
    service = build('calendar', 'v3', credentials=creds)
    
    events_result = service.events().list(
        calendarId='primary',
        maxResults=10,
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    
    events = events_result.get('items', [])
    
    resultado = [{
        "summary": event.get('summary', 'Sin título'),
        "start": event['start'].get('dateTime', event['start'].get('date')),
        "descripcion": event.get('description', '')
    } for event in events]
    
    return jsonify(resultado), 200


if __name__ == '__main__':
    app.run(debug=True)