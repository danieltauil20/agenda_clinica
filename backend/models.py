from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Paciente(db.Model):
    __tablename__ = 'pacientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    tipo_doc = db.Column(db.String(20), default='DNI')
    num_doc = db.Column(db.String(30), nullable=True)
    telefono = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=True)
    direccion = db.Column(db.String(200), nullable=True)
    contacto_emergencia = db.Column(db.String(100), nullable=True)
    tel_emergencia = db.Column(db.String(20), nullable=True)
    alergias = db.Column(db.Text, nullable=True)
    antecedentes = db.Column(db.Text, nullable=True)
    lopd = db.Column(db.Boolean, default=False)
    
    # Relaciones en cascada
    citas = db.relationship('Cita', backref='paciente', cascade='all, delete-orphan', lazy=True)
    visitas = db.relationship('Visita', backref='paciente', cascade='all, delete-orphan', lazy=True)
    presupuestos = db.relationship('Presupuesto', backref='paciente', cascade='all, delete-orphan', lazy=True)


class Cita(db.Model):
    __tablename__ = 'citas'
    
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    fecha_hora = db.Column(db.String(30), nullable=False)
    motivo = db.Column(db.String(150), nullable=False)
    estado = db.Column(db.String(20), default='Pendiente') # 'Pendiente', 'Confirmada', 'Asistió', 'Cancelada'
    google_event_id = db.Column(db.String(100), nullable=True)


class Visita(db.Model):
    __tablename__ = 'visitas'
    
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    fecha = db.Column(db.String(20), nullable=False)
    tratamiento = db.Column(db.Text, nullable=False)
    pieza_dental = db.Column(db.String(20), nullable=True) # Para el odontograma
    coste = db.Column(db.Float, default=0.0)


class Presupuesto(db.Model):
    __tablename__ = 'presupuestos'
    
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    fecha = db.Column(db.String(20), nullable=False)
    estado = db.Column(db.String(20), default='Emitido') # 'Emitido', 'Aceptado', 'Rechazado'
    total = db.Column(db.Float, default=0.0)
    
    lineas = db.relationship('LineaPresupuesto', backref='presupuesto', cascade='all, delete-orphan', lazy=True)


class LineaPresupuesto(db.Model):
    __tablename__ = 'lineas_presupuesto'
    
    id = db.Column(db.Integer, primary_key=True)
    presupuesto_id = db.Column(db.Integer, db.ForeignKey('presupuestos.id'), nullable=False)
    tratamiento = db.Column(db.String(150), nullable=False)
    pieza_dental = db.Column(db.String(20), nullable=True)
    cantidad = db.Column(db.Integer, default=1)
    precio_unitario = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float, nullable=False)