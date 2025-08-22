from flask import render_template, request, redirect, url_for, flash, session
from app import app, db
from models import User, Material, Order
from sqlalchemy import or_, and_

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        user_type = request.form['user_type']
        phone = request.form['phone']
        city = request.form['city']
        area = request.form['area']

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            flash('Username already exists', 'error')
            return render_template('register.html')
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered', 'error')
            return render_template('register.html')

        # Create new user
        user = User(
            username=username,
            email=email,
            user_type=user_type,
            phone=phone,
            city=city,
            area=area
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['user_type'] = user.user_type
            
            if user.user_type == 'vendor':
                return redirect(url_for('vendor_dashboard'))
            else:
                return redirect(url_for('supplier_dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/vendor/dashboard')
def vendor_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'vendor':
        flash('Please login as a vendor', 'error')
        return redirect(url_for('login'))
    
    # Get filter parameters
    category = request.args.get('category', '')
    city = request.args.get('city', '')
    search = request.args.get('search', '')
    
    # Base query
    query = Material.query.filter_by(is_available=True)
    
    # Apply filters
    if category:
        query = query.filter_by(category=category)
    if city:
        query = query.filter_by(city=city)
    if search:
        query = query.filter(or_(
            Material.name.contains(search),
            Material.description.contains(search)
        ))
    
    materials = query.all()
    categories = db.session.query(Material.category).distinct().all()
    cities = db.session.query(Material.city).distinct().all()
    
    return render_template('vendor_dashboard.html', 
                         materials=materials, 
                         categories=[c[0] for c in categories],
                         cities=[c[0] for c in cities],
                         current_category=category,
                         current_city=city,
                         current_search=search)

@app.route('/supplier/dashboard')
def supplier_dashboard():
    if 'user_id' not in session or session.get('user_type') != 'supplier':
        flash('Please login as a supplier', 'error')
        return redirect(url_for('login'))
    
    supplier_id = session['user_id']
    materials = Material.query.filter_by(supplier_id=supplier_id).all()
    orders = Order.query.join(Material).filter_by(supplier_id=supplier_id).all()
    
    return render_template('supplier_dashboard.html', materials=materials, orders=orders)

@app.route('/supplier/add_material', methods=['GET', 'POST'])
def add_material():
    if 'user_id' not in session or session.get('user_type') != 'supplier':
        flash('Please login as a supplier', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        supplier_id = session['user_id']
        user = User.query.get(supplier_id)
        
        material = Material(
            name=request.form['name'],
            category=request.form['category'],
            description=request.form['description'],
            price_per_unit=float(request.form['price_per_unit']),
            unit=request.form['unit'],
            stock_quantity=int(request.form['stock_quantity']),
            supplier_id=supplier_id,
            city=user.city,  # Use supplier's city
            area=user.area   # Use supplier's area
        )
        
        db.session.add(material)
        db.session.commit()
        
        flash('Material added successfully!', 'success')
        return redirect(url_for('supplier_dashboard'))
    
    return render_template('add_material.html')

@app.route('/vendor/place_order/<int:material_id>', methods=['GET', 'POST'])
def place_order(material_id):
    if 'user_id' not in session or session.get('user_type') != 'vendor':
        flash('Please login as a vendor', 'error')
        return redirect(url_for('login'))
    
    material = Material.query.get_or_404(material_id)
    
    if request.method == 'POST':
        quantity = int(request.form['quantity'])
        delivery_address = request.form['delivery_address']
        notes = request.form.get('notes', '')
        
        if quantity > material.stock_quantity:
            flash('Requested quantity exceeds available stock', 'error')
            return render_template('place_order.html', material=material)
        
        total_price = quantity * material.price_per_unit
        
        order = Order(
            vendor_id=session['user_id'],
            material_id=material_id,
            quantity=quantity,
            total_price=total_price,
            delivery_address=delivery_address,
            notes=notes
        )
        
        # Update material stock
        material.stock_quantity -= quantity
        if material.stock_quantity == 0:
            material.is_available = False
        
        db.session.add(order)
        db.session.commit()
        
        flash('Order placed successfully!', 'success')
        return redirect(url_for('vendor_orders'))
    
    return render_template('place_order.html', material=material)

@app.route('/vendor/orders')
def vendor_orders():
    if 'user_id' not in session or session.get('user_type') != 'vendor':
        flash('Please login as a vendor', 'error')
        return redirect(url_for('login'))
    
    orders = Order.query.filter_by(vendor_id=session['user_id']).order_by(Order.created_at.desc()).all()
    return render_template('orders.html', orders=orders, user_type='vendor')

@app.route('/supplier/orders')
def supplier_orders():
    if 'user_id' not in session or session.get('user_type') != 'supplier':
        flash('Please login as a supplier', 'error')
        return redirect(url_for('login'))
    
    orders = Order.query.join(Material).filter_by(supplier_id=session['user_id']).order_by(Order.created_at.desc()).all()
    return render_template('orders.html', orders=orders, user_type='supplier')

@app.route('/update_order_status/<int:order_id>/<status>')
def update_order_status(order_id, status):
    if 'user_id' not in session or session.get('user_type') != 'supplier':
        flash('Access denied', 'error')
        return redirect(url_for('login'))
    
    order = Order.query.get_or_404(order_id)
    
    # Verify that this supplier owns this order
    if order.material.supplier_id != session['user_id']:
        flash('Access denied', 'error')
        return redirect(url_for('supplier_dashboard'))
    
    order.status = status
    db.session.commit()
    
    flash(f'Order status updated to {status}', 'success')
    return redirect(url_for('supplier_orders'))
